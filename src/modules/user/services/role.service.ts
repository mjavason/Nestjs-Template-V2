import { AUTH_PERMISSIONS } from '@/modules/auth/auth.permission';
import { MAIL_PERMISSIONS } from '@/modules/mail/mail.permission';
import { ROLE_PERMISSIONS } from '@/modules/user/permissions/role.permission';
import { USER_PERMISSIONS } from '@/modules/user/permissions/user.permission';
import { APP_PERMISSIONS } from '@common/app.permission';
import { Role, RoleDocumentType } from '@common/models/user/role.schema';
import { APP_MODULES } from '@configs/constants/constants';
import log from '@configs/logger/logger.config';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocumentType>,
  ) {}

  async findAll() {
    const data = await this.roleModel.find().lean();
    return { data };
  }

  async findByName(name: string) {
    const data = await this.roleModel.findOne({ name }).lean();

    if (!data) {
      log.info({
        context: `${RoleService.name}#${this.findByName.name}`,
        message: 'Role not found by name',
        roleName: name,
      });
    }

    return { data };
  }

  async create(roleData: Partial<Role>) {
    const role = await this.roleModel.create(roleData);

    log.info({
      context: `${RoleService.name}#${this.create.name}`,
      message: 'Role created successfully',
      roleId: role._id,
      roleName: role.name,
    });

    return { message: 'Role created successfully' };
  }

  async findAllPermissions(): Promise<string[]> {
    const permissions = [
      ...Object.values(USER_PERMISSIONS),
      ...Object.values(ROLE_PERMISSIONS),
      ...Object.values(MAIL_PERMISSIONS),
      ...Object.values(AUTH_PERMISSIONS),
      ...Object.values(APP_PERMISSIONS),
    ];
    return permissions;
  }

  async findAllPermissionsByModule(moduleName: string): Promise<string[]> {
    let permissions: string[];

    switch (moduleName) {
      case APP_MODULES.USER:
        permissions = Object.values(USER_PERMISSIONS);
        break;
      case APP_MODULES.ROLE:
        permissions = Object.values(ROLE_PERMISSIONS);
        break;
      case APP_MODULES.MAIL:
        permissions = Object.values(MAIL_PERMISSIONS);
        break;
      case APP_MODULES.AUTH:
        permissions = Object.values(AUTH_PERMISSIONS);
        break;
      case APP_MODULES.GLOBAL:
        permissions = Object.values(APP_PERMISSIONS);
        break;
      default:
        permissions = [];
    }

    return permissions;
  }
}
