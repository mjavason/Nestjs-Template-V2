import { UserService } from '@/modules/user/services/user.service';
import { Auth } from '@common/decorators/auth.decorator';
import { ObjectIdParamDto } from '@common/dtos/object-id.dto';
import { PaginationQueryDto } from '@common/dtos/pagination.dto';
import { UserTypeEnum } from '@common/types/user/user.enum';
import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterUserDto } from '../dtos/filter-user.dto';
import { UpdateProfileAdminDto } from '../dtos/update-profile-admin.dto';
import {
  PaginatedUserProfileOutputDto,
  UserProfileOutputDto,
} from '../types/user-profile-output.type';

@Controller('user_admin')
@ApiTags('User - Admin')
export class UserAdminController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOkResponse({ type: PaginatedUserProfileOutputDto })
  @ApiOperation({ summary: 'Filter users with pagination' })
  @Auth([UserTypeEnum.ADMIN])
  async getUsers(
    @Query() filter: FilterUserDto,
    @Query() query: PaginationQueryDto,
  ) {
    return await this.userService.filterUsers(filter, query.page, query.limit);
  }

  @Get(':id/profile')
  @ApiOkResponse({ type: UserProfileOutputDto })
  @ApiOperation({ summary: 'Get user profile by id' })
  @Auth([UserTypeEnum.ADMIN])
  async profile(@Param() param: ObjectIdParamDto) {
    return await this.userService.getUserProfileById(param.id);
  }

  @Patch(':id/toggle-block')
  @ApiOperation({
    summary: 'Block/unblock a user account',
  })
  @Auth([UserTypeEnum.ADMIN])
  async blockOrUnblockUserAccount(@Param() param: ObjectIdParamDto) {
    return await this.userService.blockOrUnblockUserAccount(param.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a user profile',
  })
  @Auth([UserTypeEnum.ADMIN])
  async updateUserProfile(
    @Param() param: ObjectIdParamDto,
    @Body() body: UpdateProfileAdminDto,
  ) {
    return await this.userService.updateProfile(param.id, body);
  }
}
