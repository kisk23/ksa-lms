import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//link the guard with strategy using the name in AuthGuard : 'jwt' = jwt.strategy.ts name
//export class JwtStrategy extends PassportStrategy(Strategy, 'jwt')
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
