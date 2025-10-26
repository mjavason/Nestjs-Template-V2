import { ApiProperty } from '@nestjs/swagger';

export type AuthSignupOutput = {
  id: string;
  email: string;
  token: string;
  isEmailVerified: boolean;
  userName: string;
};

export class AuthSignupOutputData implements AuthSignupOutput {
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
}

export class AuthSignupOutputDto {
  @ApiProperty({ type: Boolean, example: true })
  success: boolean;

  @ApiProperty({ type: String, example: 'Successful' })
  message: string;

  @ApiProperty({ type: AuthSignupOutputData })
  data: AuthSignupOutputData;
}
