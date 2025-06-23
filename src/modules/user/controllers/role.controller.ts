import { RoleService } from '@/modules/user/services/role.service';
import { Auth } from '@common/decorators/auth.decorator';
import { APP_MODULES } from '@configs/constants/constants';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('role')
@ApiTags('Role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Auth()
  @ApiOperation({ summary: 'Retrieve all roles' })
  async findAll() {
    return this.roleService.findAll();
  }

  @Get('permissions')
  @Auth()
  @ApiOperation({ summary: 'Retrieve all permissions' })
  async findAllPermissions() {
    return this.roleService.findAllPermissions();
  }

  @Get('permissions/modules/:module')
  @Auth()
  @ApiOperation({ summary: 'Retrieve all permissions grouped by module' })
  @ApiParam({
    name: 'module',
    enum: APP_MODULES,
    required: true,
    description: 'Target module to retrieve permissions for',
  })
  async findAllPermissionsByModule(@Param('module') module: APP_MODULES) {
    return this.roleService.findAllPermissionsByModule(module);
  }
}
