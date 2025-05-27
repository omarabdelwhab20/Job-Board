import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ResetPasswordtDto } from './dto/reset-password.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Get('verify-email/:token')
  verifyEmail(@Param('token') token: string) {
    console.log('Received token:', token);
    return this.authService.verifyEmail(token);
  }

  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordtDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('verify-code')
  verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
    return this.authService.verifyCode(verifyCodeDto);
  }

  @Post('change-password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }
}
