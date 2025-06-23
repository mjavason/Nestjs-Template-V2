import { AUTH_PERMISSIONS } from './auth.permission';
import { MAIL_PERMISSIONS } from './mail.permission';
import { ROLE_PERMISSIONS } from './role.permission';
import { USER_PERMISSIONS } from './user.permission';

export enum APP_PERMISSIONS {
  READ_STATUS = 'read_status',
  RESTART_APP = 'restart_app',
}

export const ALL_PERMISSIONS = [
  ...Object.values(USER_PERMISSIONS),
  ...Object.values(ROLE_PERMISSIONS),
  ...Object.values(MAIL_PERMISSIONS),
  ...Object.values(AUTH_PERMISSIONS),
  ...Object.values(APP_PERMISSIONS),
];
