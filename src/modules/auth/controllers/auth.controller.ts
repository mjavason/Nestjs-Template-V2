import { ConfirmEmailDto } from '@/modules/auth/dtos/confirm-email-address.dto';
import { ForgotPasswordDto } from '@/modules/auth/dtos/forgot-email.dto';
import { RequestEmailVerificationDto } from '@/modules/auth/dtos/request-email-verification.dto';
import { ResetPasswordDto } from '@/modules/auth/dtos/reset-password.dto';
import { LoginDto } from '@/modules/auth/dtos/sign-in.dto';
import { SignUpDto } from '@/modules/auth/dtos/sign-up.dto';
import { SocialSignUpDto } from '@/modules/auth/dtos/social-signup.dto';
import { Verify2FADto } from '@/modules/auth/dtos/verify-2fa.dto';
import { AuthService } from '@/modules/auth/services/auth.service';
import { AuthSignupOutputDto } from '@/modules/auth/types/auth-outputs.types';
import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign_up')
  @ApiOperation({ summary: 'Sign up' })
  @ApiOkResponse({ type: AuthSignupOutputDto })
  async register(@Body() body: SignUpDto) {
    return await this.authService.signUpUser(body);
  }

  @Post('confirm_email')
  @ApiOperation({ summary: 'Confirm email address with token' })
  async confirmEmail(@Body() body: ConfirmEmailDto) {
    return await this.authService.confirmEmail(body);
  }

  @Post('sign_in')
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @Post('forgot_password')
  @ApiOperation({ summary: 'Forgot password request' })
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return await this.authService.forgotPassword(body);
  }

  @Post('reset_password')
  @ApiOperation({
    summary: 'Continuation of forgot password flow. Reset password',
  })
  async resetPassword(@Body() body: ResetPasswordDto) {
    return await this.authService.resetPassword(body);
  }

  @Post('request_email_verification')
  @ApiOperation({ summary: 'Request email verification' })
  async requestEmail(@Body() dto: RequestEmailVerificationDto) {
    return await this.authService.requestEmailVerification(dto);
  }

  @Post('username/:userName')
  @ApiOperation({ summary: 'Is user name available?' })
  async isUserNameAvailable(@Param('userName') userName: string) {
    return await this.authService.isUserNameAvailable(userName);
  }

  @Post('social_auth')
  @ApiOperation({
    summary: 'Social auth',
    description:
      'Use this to get a google token if need be: https://get-my-social-token.onrender.com/',
  })
  async socialRegister(@Body() body: SocialSignUpDto) {
    return await this.authService.socialAuth(body);
  }

  @Post('verify_2fa')
  @ApiOperation({ summary: 'Verify 2FA code' })
  @ApiOkResponse({ type: AuthSignupOutputDto })
  async verify2FA(@Body() body: Verify2FADto) {
    return await this.authService.verifyTwoFactor(body.email, body.code);
  }
}
