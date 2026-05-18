import { UserRole } from '@lms/shared-types';
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import type { User } from '../../generated/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterStudentDto } from './dto/register.dto';
import { sanitizeUser, type SafeUser } from './utils/sanitize-user';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  // async register(dto: RegisterDto) {
  //   const existingUser = await this.usersService.findByIdentity(dto.identity);
  //   if (existingUser) {
  //     throw new ConflictException('ALREADY_ENROLLED');
  //   }

  //   if (dto.email) {
  //     const userByEmail = await this.prisma.user.findUnique({ where: { email: dto.email } });
  //     if (userByEmail) {
  //       throw new ConflictException('EMAIL_ALREADY_EXISTS');
  //     }
  //   }

  //   const salt = await bcrypt.genSalt();
  //   const passwordHash = await bcrypt.hash(dto.password, salt);

  //   const user = await this.prisma.user.create({
  //     data:  {
  //       name: dto.name,
  //       email: dto.email,
  //       identity: dto.identity,
  //       phone: dto.phone,
  //       guardianPhone: dto.guardianPhone,
  //       guardianIdentity: dto.guardianIdentity,
  //       passwordHash: passwordHash,
  //       role: dto.role,
  //     },
  //   });

  //   //how to enuser the gurdian phone related to the user do we need to send OTP to him?

  //   // Generate OTP for verification
  //   //redirct to otp screen to make the user verified after entering the code
  //   await this.generateOtp(user.id);

  //   const { passwordHash: _, ...result } = user;
  //   return result;
  // }
  // auth.service.ts  (register method)
  async register(dto: RegisterStudentDto) {
    const studentPasswordHash = await bcrypt.hash(dto.password, 10);
    const temporaryGuardianPassword = dto.guardian.identity;
    const guardianPasswordHash = await bcrypt.hash(temporaryGuardianPassword, 10);

    const result = await this.prisma.$transaction(async (tx) => {
      // ── 1. Student uniqueness ──────────────────────────────────────────
      const existingStudent = await tx.user.findFirst({
        where: {
          OR: [{ identity: dto.identity }, { email: dto.email }, { phone: dto.phone }],
        },
      });
      if (existingStudent) {
        throw new ConflictException('STUDENT_ALREADY_EXISTS');
      }

      // ── 2. Guardian lookup by identity ────────────────────────────────
      let guardian = await tx.user.findUnique({
        where: { identity: dto.guardian.identity },
      });

      let isNewGuardian = false;

      if (!guardian) {
        // ── 3a. New guardian — check their email/phone aren't taken ─────
        const conflictingUser = await tx.user.findFirst({
          where: {
            OR: [{ email: dto.guardian.email }, { phone: dto.guardian.phone }],
          },
        });
        if (conflictingUser) {
          throw new ConflictException('GUARDIAN_CONTACT_CONFLICT');
        }

        guardian = await tx.user.create({
          data: {
            name: dto.guardian.name,
            email: dto.guardian.email,
            phone: dto.guardian.phone,
            identity: dto.guardian.identity,
            passwordHash: guardianPasswordHash,
            role: UserRole.PARENT,
            guardianIdentity: null,
            guardianPhone: null,
          },
        });
        isNewGuardian = true;
      } else {
        // ── 3b. Existing guardian — must actually be a PARENT ────────────
        if (guardian.role !== UserRole.PARENT) {
          throw new ConflictException('GUARDIAN_ROLE_MISMATCH');
        }
      }

      // ── 4. Create student ─────────────────────────────────────────────
      const student = await tx.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          phone: dto.phone,
          identity: dto.identity,
          passwordHash: studentPasswordHash,
          role: UserRole.STUDENT,
          guardianIdentity: dto.guardian.identity,
          guardianPhone: dto.guardian.phone,
        },
      });

      // ── 5. Link guardian ↔ student (unique constraint handles dups) ───
      // upsert avoids a redundant findFirst + create round-trip.
      // The @@unique([parentUserId, studentUserId, relationship]) on the
      // model means a true duplicate just becomes a no-op update.
      await tx.parentStudentLink.upsert({
        where: {
          parentUserId_studentUserId_relationship: {
            parentUserId: guardian.id,
            studentUserId: student.id,
            relationship: dto.guardian.relationship,
          },
        },
        create: {
          parentUserId: guardian.id,
          studentUserId: student.id,
          relationship: dto.guardian.relationship,
        },
        update: {}, // already linked — no-op
      });

      return { student, guardian, isNewGuardian, temporaryGuardianPassword };
    });

    // ── 6. Post-transaction side-effects ──────────────────────────────
    // Always send OTP to the new student.
    // Only send OTP + credentials to guardian if they were just created.
    const otpTasks: Promise<unknown>[] = [this.generateOtp(result.student.id)];

    if (result.isNewGuardian) {
      otpTasks.push(this.generateOtp(result.guardian.id));
    }

    await Promise.all(otpTasks);

    const session = await this.createSession(result.student);

    return {
      message: 'REGISTER_SUCCESS',
      studentId: result.student.id,
      guardianId: result.guardian.id,
      user: session.user,
      tokens: session.tokens,
    };
  }

  async generateOtp(userId: string) {
    // Check rate limit (3/hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentOtps = await this.prisma.otpVerification.findMany({
      where: { userId, createdAt: { gte: oneHourAgo } },
      orderBy: { createdAt: 'asc' }, // Oldest first
      take: 3,
    });

    if (recentOtps.length >= 5) {
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

  async verifyOtp(userId: string, code: string) {
    const user = await this.usersService.findOne(userId);

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

    await this.prisma.$transaction([
      this.prisma.otpVerification.update({
        where: { id: otp.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      }),
    ]);

    const verifiedUser = { ...user, isVerified: true };
    return this.createSession(verifiedUser);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByIdentityOrPhone(dto.identity);
    if (!user) throw new UnauthorizedException('INVALID_CREDENTIALS');

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) throw new UnauthorizedException('INVALID_CREDENTIALS');

    return this.createSession(user);
  }

  async resendOtp(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (user.isVerified) {
      throw new ForbiddenException('ALREADY_VERIFIED');
    }
    return this.generateOtp(user.id);
  }

  async getMe(userId: string): Promise<SafeUser> {
    const user = await this.usersService.findOne(userId);
    return sanitizeUser(user);
  }

  async createSession(user: User) {
    const tokens = await this.getTokens(user.id, user.role, user.isVerified);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return {
      user: sanitizeUser(user),
      tokens,
    };
  }

  async getTokens(userId: string, role: string, isVerified: boolean) {
    const payload = { sub: userId, role, isVerified };
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15m',
      }),
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

  // async getTokensForCookies(userId: string, role: string, isVerified: boolean) {
  //   return this.getTokens(userId, role, isVerified);
  // }

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

    const tokens = await this.getTokens(user.id, user.role, user.isVerified);
    await this.updateRtHash(user.id, tokens.refreshToken);

    return tokens;
  }
}
