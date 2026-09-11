import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LoginFirebaseDto } from './dto/sign-in-dto';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { FirebaseUser } from 'src/common/types/authenticated-user.type';
import type { Response, Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

const isProduction = process.env.NODE_ENV === 'production';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up-admin')
  createAdminUser(@Body() body: LoginDto) {
    return this.authService.createAdmin(body);
  }

  @Get('me-admin')
  @UseGuards(JwtAuthGuard)
  async admin_user(@CurrentUser() user: FirebaseUser) {
    return this.authService.adminProfile(user);
  }

  @Post('login-admin')
  async adminLogin(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.loginAdmin(body);

    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000,
    });

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      success: true,
      message: 'Login successful',
    };
  }

  @Post('logout-admin')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookies = req.cookies as Record<string, unknown>;
    const refreshToken = cookies['refresh_token'];

    if (typeof refreshToken !== 'string') {
      throw new UnauthorizedException('Refresh token not found');
    }

    const { accessToken } =
      await this.authService.refreshAccessToken(refreshToken);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000,
    });

    return {
      success: true,
    };
  }

  @Post('login')
  login(@Body() body: LoginFirebaseDto) {
    return this.authService.loginFirebase({
      idToken: body.idToken,
    });
  }

  @Post('send-otp')
  sendOtp(@Body() body: { email: string }) {
    return this.authService.sendOtp({
      email: body.email,
    });
  }

  @Post('verify-otp')
  verifyOtp(@Body() body: { email: string; otp: string }) {
    return this.authService.verifyOtp({
      email: body.email,
      otp: body.otp,
    });
  }

  @Get('me')
  @UseGuards(FirebaseAuthGuard)
  async user_data(@CurrentUser() user: FirebaseUser) {
    return this.authService.profile(user);
  }
}
