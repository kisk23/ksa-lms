import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'jwt-secret'), //remove before deploy
    });
  }
  //return {
  //"sub": "user_uuid_123",  // This is the User ID
  //"role": "STUDENT",
  //"iat": 1714310000,       // Issued At (Timestamp)
  //"exp": 1714310900        // Expiration (Timestamp)
  //} as payload to validate

  async validate(payload: { sub: string; [key: string]: unknown }) {
    const user = await this.usersService.findOne(payload.sub);
    if (!user?.isActive) {
      //ensure that the controller will have an existed active user
      throw new UnauthorizedException();
    }
    return user;
  }
}
