import { AUTH_PERMISSIONS } from '@configs/constants/permissions/auth.permission';
import { APP_PERMISSIONS } from '@configs/constants/permissions/global.permission';
import { MAIL_PERMISSIONS } from '@configs/constants/permissions/mail.permission';
import { ROLE_PERMISSIONS } from '@configs/constants/permissions/role.permission';
import { USER_PERMISSIONS } from '@configs/constants/permissions/user.permission';

export type AnyPermission =
  | USER_PERMISSIONS
  | ROLE_PERMISSIONS
  | MAIL_PERMISSIONS
  | AUTH_PERMISSIONS
  | APP_PERMISSIONS;
