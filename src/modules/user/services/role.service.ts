import { Role, RoleDocumentType } from '@common/models/user/role.schema';
import { APP_MODULES } from '@configs/constants/constants';
import { AUTH_PERMISSIONS } from '@configs/constants/permissions/auth.permission';
import { APP_PERMISSIONS } from '@configs/constants/permissions/global.permission';
import { MAIL_PERMISSIONS } from '@configs/constants/permissions/mail.permission';
import { ROLE_PERMISSIONS } from '@configs/constants/permissions/role.permission';
import { USER_PERMISSIONS } from '@configs/constants/permissions/user.permission';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocumentType>,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleModel.find().lean();
  }

  async findByName(name: string): Promise<Role | null> {
    return this.roleModel.findOne({ name }).lean();
  }

  async create(roleData: Partial<Role>): Promise<Role> {
    const role = new this.roleModel(roleData);
    return role.save();
  }

  async findAllPermissions(): Promise<string[]> {
    return [
      ...Object.values(USER_PERMISSIONS),
      ...Object.values(ROLE_PERMISSIONS),
      ...Object.values(MAIL_PERMISSIONS),
      ...Object.values(AUTH_PERMISSIONS),
      ...Object.values(APP_PERMISSIONS),
    ];
  }

  async findAllPermissionsByModule(moduleName: string): Promise<string[]> {
    switch (moduleName) {
      case APP_MODULES.USER:
        return Object.values(USER_PERMISSIONS);
      case APP_MODULES.ROLE:
        return Object.values(ROLE_PERMISSIONS);
      case APP_MODULES.MAIL:
        return Object.values(MAIL_PERMISSIONS);
      case APP_MODULES.AUTH:
        return Object.values(AUTH_PERMISSIONS);
      case APP_MODULES.GLOBAL:
        return Object.values(APP_PERMISSIONS);
      default:
        return [];
    }
  }
}
