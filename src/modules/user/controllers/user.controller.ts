import { UpdateProfileDto } from '@/modules/user/dtos/update-profile.dto';
import { UserService } from '@/modules/user/services/user.service';
import { transformUserProfile } from '@/modules/user/transformers/user-profile.transformer';
import { UserProfileOutputDto } from '@/modules/user/types/user-profile-output.type';
import { Auth, UserContextParam } from '@common/decorators/auth.decorator';
import { UserDocumentType } from '@common/models/user/user.schema';
import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOkResponse({ type: UserProfileOutputDto })
  @ApiOperation({ summary: 'Retrieve logged in users profile' })
  @Auth()
  async profile(@UserContextParam() auth: UserDocumentType) {
    return transformUserProfile(auth);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update logged in user profile' })
  @Auth()
  async updateProfile(
    @UserContextParam() auth: UserDocumentType,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(auth.id, dto);
  }

  // @Patch('kyc_status/:userId')
  // @ApiOperation({
  //   summary:
  //     '(Admins Only) Update a particular users kyc status. This happens after successfully reviewing their documents',
  // })
  // @Auth() // TODO: Add required roles
  // async updateUserKycStatus(
  //   @UserContextParam() auth: UserDocumentType,
  //   @Param('userId') userId: string,
  //   @Body()
  //   dto: UpdateUserKycStatusDto,
  // ) {
  //   return await this.userService.updateUserKycStatus(userId, dto);
  // }
}
