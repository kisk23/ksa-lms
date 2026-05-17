import { Controller, Post, Get, Body, Res, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';
import type { Response } from 'express';

import { AuthService } from './auth.service';
import { clearAuthCookies, setAuthCookies } from './constants/auth-cookies';
import { GetCurrentUser } from './decorators/get-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterStudentDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RtAuthGuard } from './guards/rt-auth.guard';
import type { User } from '../../generated/client';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new student account' })
  async register(@Body() dto: RegisterStudentDto, @Res() res: Response) {
    const result = await this.authService.register(dto);
    const tokens = await this.authService.getTokensForCookies(
      result.user.id,
      result.user.role,
      result.user.isVerified,
    );
    setAuthCookies(res, tokens);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      data: {
        message: result.message,
        user: result.user,
      },
    });
  }

  @Post('verify-otp')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Verify phone OTP (authenticated)' })
  async verifyOtp(@GetCurrentUser() user: User, @Body() dto: VerifyOtpDto, @Res() res: Response) {
    const session = await this.authService.verifyOtp(user.id, dto.code);
    const tokens = await this.authService.getTokensForCookies(
      session.user.id,
      session.user.role,
      session.user.isVerified,
    );
    setAuthCookies(res, tokens);

    return res.status(HttpStatus.OK).json({
      success: true,
      data: { user: session.user },
    });
  }

  @Post('login')
  @ApiOperation({ summary: 'Login and set HttpOnly auth cookies' })
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const session = await this.authService.login(dto);
    const tokens = await this.authService.getTokensForCookies(
      session.user.id,
      session.user.role,
      session.user.isVerified,
    );
    setAuthCookies(res, tokens);

    return res.status(HttpStatus.OK).json({
      success: true,
      data: { user: session.user },
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Get current authenticated user' })
  async me(@GetCurrentUser('id') userId: string) {
    return this.authService.getMe(userId);
  }

  @UseGuards(RtAuthGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(
    @GetCurrentUser('sub') userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
    @Res() res: Response,
  ) {
    const tokens = await this.authService.refreshTokens(userId, refreshToken);
    setAuthCookies(res, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });

    return res.status(HttpStatus.OK).json({
      success: true,
      data: { ok: true },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Logout and revoke refresh token' })
  async logout(@GetCurrentUser('id') userId: string, @Res() res: Response) {
    await this.authService.logout(userId);
    clearAuthCookies(res);
    return res.status(HttpStatus.OK).json({ success: true });
  }

  @Post('resend-otp')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Resend OTP (authenticated)' })
  async resendOtp(@GetCurrentUser('id') userId: string) {
    return this.authService.resendOtp(userId);
  }
}
