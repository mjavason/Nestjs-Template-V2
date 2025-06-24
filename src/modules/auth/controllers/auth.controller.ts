import { AuthService } from '@/modules/auth/services/auth.service';
import { Auth, UserContextParam } from '@common/decorators/auth.decorator';
import { UserDocumentType } from '@common/models/user/user.schema';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfirmEmailDto } from '../dtos/confirm-email-address.dto';
import { ConfirmPhoneNumberDto } from '../dtos/confirm-phone-number.dto';
import { ForgotPasswordDto } from '../dtos/forgot-email.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { SetPasswordDto } from '../dtos/set-password.dto';
import { LoginDto } from '../dtos/sign-in.dto';
import { SignUpDto } from '../dtos/sign-up.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign_up')
  @ApiOperation({ summary: 'Sign up' })
  @ApiBody({ type: SignUpDto })
  async register(@Body() body: SignUpDto) {
    return await this.authService.signUpUser(body);
  }

  @Post('confirm_email')
  @ApiOperation({ summary: 'Confirm email address with token' })
  @ApiBody({ type: ConfirmEmailDto })
  async confirmEmail(@Body() body: ConfirmEmailDto) {
    return await this.authService.confirmEmail(body);
  }

  @Post('create_password')
  @ApiOperation({ summary: 'Create password' })
  @ApiBody({ type: SetPasswordDto })
  @Auth()
  async createPassword(
    @Body() body: SetPasswordDto,
    @UserContextParam() auth: UserDocumentType,
  ) {
    return await this.authService.createPassword(body, auth.id);
  }

  @Post('confirm_phone_number')
  @ApiOperation({ summary: 'Confirm phone number with token' })
  @ApiBody({ type: ConfirmPhoneNumberDto })
  async confirmPhoneNumber(@Body() body: ConfirmPhoneNumberDto) {
    return await this.authService.confirmPhoneNumber(body);
  }

  @Post('sign_in')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @Post('forgot_password')
  @ApiOperation({ summary: 'Forgot password request' })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return await this.authService.forgotPassword(body);
  }

  @Post('reset_password')
  @ApiOperation({
    summary: 'Continuation of forgot password flow. Reset password',
  })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() body: ResetPasswordDto) {
    return await this.authService.resetPassword(body);
  }
}
