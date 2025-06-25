import { AUTH_PERMISSIONS } from '@/modules/auth/auth.permission';
import { transformUserProfile } from '@/modules/user/transformers/user-profile.transformer';
import { UserProfileOutputDto } from '@/modules/user/types/user-profile-output.type';
import { Auth, UserContextParam } from '@common/decorators/auth.decorator';
import { UserDocumentType } from '@common/models/user/user.schema';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('User')
export class UserController {
  @Get('profile')
  @Auth([AUTH_PERMISSIONS.LOGIN])
  @ApiOkResponse({ type: UserProfileOutputDto })
  @ApiOperation({ summary: 'Retrieve logged in users profile' })
  async profile(@UserContextParam() auth: UserDocumentType) {
    return transformUserProfile(auth);
  }
}
