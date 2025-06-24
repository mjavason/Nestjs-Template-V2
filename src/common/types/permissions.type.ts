import { AUTH_PERMISSIONS } from '@/modules/auth/auth.permission';
import { MAIL_PERMISSIONS } from '@/modules/mail/mail.permission';
import { ROLE_PERMISSIONS } from '@/modules/user/role.permission';
import { USER_PERMISSIONS } from '@/modules/user/user.permission';
import { APP_PERMISSIONS } from '@common/app.permission';

export type AnyPermission =
  | USER_PERMISSIONS
  | ROLE_PERMISSIONS
  | MAIL_PERMISSIONS
  | AUTH_PERMISSIONS
  | APP_PERMISSIONS;
