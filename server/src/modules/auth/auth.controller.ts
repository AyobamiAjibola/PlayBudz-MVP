import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginFirebaseDto } from './dto/sign-in-dto';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { FirebaseUser } from 'src/common/types/authenticated-user.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
