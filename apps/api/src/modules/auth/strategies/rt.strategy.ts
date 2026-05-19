import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
// eslint-disable-next-line import/no-unresolved
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { REFRESH_TOKEN_COOKIE } from '../constants/auth-cookies';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.[REFRESH_TOKEN_COOKIE];
        },
      ]),
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET', 'rt-secret'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: { sub: string; [key: string]: unknown }) {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE];
    if (!refreshToken) throw new UnauthorizedException();

    return {
      ...payload,
      refreshToken,
    };
  }
}
