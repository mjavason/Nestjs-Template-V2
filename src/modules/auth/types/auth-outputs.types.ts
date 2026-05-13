import { ApiProperty } from '@nestjs/swagger';

export class AuthSignupOutputData {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  token: string;

  @ApiProperty()
  isEmailVerified: boolean;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  userType: string;
}

export class AuthSignupOutputDto {
  @ApiProperty({ type: Boolean, example: true })
  success: boolean;

  @ApiProperty({ type: String, example: 'Successful' })
  message: string;

  @ApiProperty({ type: AuthSignupOutputData })
  data: AuthSignupOutputData;
}
