import { RoleDocumentType } from '@common/models/user/role.schema';
import { ApiProperty } from '@nestjs/swagger';

export class UserProfileOutput {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  userName?: string;

  @ApiProperty({ required: false })
  pictureUrl?: string;

  @ApiProperty()
  isEmailVerified: boolean;

  @ApiProperty({ type: Object })
  role: RoleDocumentType;

  @ApiProperty()
  status: string;

  @ApiProperty()
  isSuper: boolean;

  @ApiProperty({ type: [String] })
  permissions: string[];

  @ApiProperty()
  is2FAEnabled: boolean;

  @ApiProperty()
  hasActiveSubscription: boolean;

  @ApiProperty()
  isAutoSubscriptionEnabled: boolean;
}

export class UserProfileOutputDto {
  @ApiProperty({ type: Boolean, example: true })
  success: boolean;

  @ApiProperty({ type: String, example: 'Successful' })
  message: string;

  @ApiProperty({ type: UserProfileOutput })
  data: UserProfileOutput;
}
