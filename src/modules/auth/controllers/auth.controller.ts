import { AuthService } from '@/modules/auth/services/auth.service';
import { SignUpDto } from '@/modules/auth/validation/sign-up.validation';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign_up')
  @ApiOperation({ summary: 'Sign up' })
  @ApiBody({ type: SignUpDto })
  async register(@Body() body: SignUpDto) {
    return await this.authService.signUpUser(body);
  }
}
