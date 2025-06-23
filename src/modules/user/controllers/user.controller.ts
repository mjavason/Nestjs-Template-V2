import { Auth, CurrentUser } from '@common/decorators/auth.decorator';
import { UserDocumentType } from '@common/models/user/user.schema';
import { stripToSchema } from '@common/utils/strip-to-schema.util';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AUTH_PERMISSIONS } from '../../../configs/constants/permissions/auth.permission';
import {
  UserProfileOutputDto,
  userProfileOutputSchema,
} from '../types/user-profile-output.type';

@Controller('user')
@ApiTags('User')
export class UserController {
  @Get('profile')
  @Auth([AUTH_PERMISSIONS.LOGIN])
  @ApiOkResponse({ type: UserProfileOutputDto })
  @ApiOperation({ summary: 'Retrieve logged in users profile' })
  async profile(@CurrentUser() auth: UserDocumentType) {
    return stripToSchema(userProfileOutputSchema, auth);
  }
}
