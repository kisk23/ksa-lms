import { UserRole } from '@lms/shared-types';
import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByIdentity(dto.identity);
    if (existingUser) {
      throw new ConflictException('ALREADY_ENROLLED'); // Using contract error code
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        identity: dto.identity,
        phone: dto.phone,
        guardianPhone: dto.guardianPhone,
        passwordHash: passwordHash,
        role: dto.role || UserRole.STUDENT,
      },
    });

    //how to enuser the gurdian phone related to the user do we need to send OTP to him?

    // Generate OTP for verification
    //redirct to otp screen to make the user verified after entering the code
    await this.generateOtp(user.id);

    const { passwordHash: _, ...result } = user;
    return result;
  }

  async generateOtp(userId: string) {
    // Check rate limit (3/hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentOtps = await this.prisma.otpVerification.findMany({
      where: { userId, createdAt: { gte: oneHourAgo } },
      orderBy: { createdAt: 'asc' }, // Oldest first
      take: 3,
    });

    if (recentOtps.length >= 3) {
      const oldestOtp = recentOtps[0];
      const nextAvailableTime = oldestOtp.createdAt.getTime() + 60 * 60 * 1000;
      const minutesToWait = Math.ceil((nextAvailableTime - Date.now()) / (60 * 1000));

      throw new UnauthorizedException(`OTP_MAX_REQUESTS: Please wait ${minutesToWait} minutes`);
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.prisma.otpVerification.create({
      data: {
        userId,
        code,
        expiresAt,
      },
    });

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('USER_NOT_FOUND');

    // TODO: Integrate with SMS Gateway (e.g. firebase auhtentication, Twilio)
    console.log(`[SMS OTP] To Phone ${user.phone} Your code is ${code}`);

    return { success: true };
  }

  async verifyOtp(identifier: string, code: string) {
    const user = await this.usersService.findByIdentityOrPhone(identifier);
    if (!user) throw new UnauthorizedException('INVALID_CREDENTIALS');

    const otp = await this.prisma.otpVerification.findFirst({
      where: {
        userId: user.id,
        code,
        usedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) throw new UnauthorizedException('OTP_INVALID');
    if (otp.expiresAt < new Date()) throw new UnauthorizedException('OTP_EXPIRED');

    await this.prisma.otpVerification.update({
      where: { id: otp.id },
      data: { usedAt: new Date() },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    return { success: true };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByIdentityOrPhone(dto.identity);
    if (!user) throw new UnauthorizedException('INVALID_CREDENTIALS');

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) throw new UnauthorizedException('INVALID_CREDENTIALS');

    if (!user.isVerified) {
      throw new UnauthorizedException('OTP_VERIFICATION_REQUIRED');
    }

    const tokens = await this.getTokens(user.id, user.role);
    await this.updateRtHash(user.id, tokens.refreshToken);

    const { passwordHash: _, ...userResult } = user;
    return {
      access_token: tokens.accessToken,
      user: userResult,
      refresh_token: tokens.refreshToken, // This will be handled by cookie in controller
    };
  }

  async resendOtp(identity: string) {
    const user = await this.usersService.findByIdentityOrPhone(identity);
    if (!user) throw new UnauthorizedException('INVALID_CREDENTIALS');
    return this.generateOtp(user.id);
  }

  async getTokens(userId: string, role: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, role },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, role },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'rt-secret'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  async updateRtHash(userId: string, rt: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(rt, salt);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: hash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });
  }

  //frontend should delete both tokens from memory and cookie
  async logout(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async refreshTokens(userId: string, rt: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new UnauthorizedException('PERMISSION_DENIED');

    // Delete everything that is expired OR revoked
    // choose space vs auditing ?
    // await this.prisma.refreshToken.deleteMany({
    //   where: {
    //     OR: [
    //       { expiresAt: { lt: new Date() } },
    //       { revokedAt: { not: null } }
    //     ]
    //   }
    // });

    const activeRts = await this.prisma.refreshToken.findMany({
      where: {
        userId,
        revokedAt: null,
        expiresAt: { gte: new Date() },
      },
    });

    let isValid = false;
    for (const storedRt of activeRts) {
      if (await bcrypt.compare(rt, storedRt.tokenHash)) {
        isValid = true;

        // Revoke the token we just used so the new one is the only valid one
        await this.prisma.refreshToken.update({
          where: { id: storedRt.id },
          data: { revokedAt: new Date() },
        });

        break;
      }
    }

    if (!isValid) throw new UnauthorizedException('REFRESH_TOKEN_INVALID');

    const tokens = await this.getTokens(user.id, user.role);
    await this.updateRtHash(user.id, tokens.refreshToken);

    return tokens;
  }
}
