import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersService } from '../../users/users.service';
import { ACCESS_TOKEN_COOKIE } from '../constants/auth-cookies';

export type JwtPayload = {
  sub: string;
  role: string;
  isVerified: boolean;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.[ACCESS_TOKEN_COOKIE] ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'jwt-secret'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findOne(payload.sub);
    if (!user?.isActive) {
      throw new UnauthorizedException();
    }

    if (user.isBanned) {
      if (!user.banExpiresAt || new Date(user.banExpiresAt) > new Date()) {
        throw new UnauthorizedException('حسابك موقوف');
      }
    }

    return user;
  }
}
