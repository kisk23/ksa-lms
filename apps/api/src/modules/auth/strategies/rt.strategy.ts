import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
// eslint-disable-next-line import/no-unresolved
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.['refresh_token'];
        },
      ]),
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET', 'rt-secret'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: { sub: string; [key: string]: unknown }) {
    const refreshToken = req.cookies?.['refresh_token'];
    if (!refreshToken) throw new UnauthorizedException();

    return {
      ...payload,
      refreshToken,
    };
  }
}
