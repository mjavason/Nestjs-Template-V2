import { AUTH_PERMISSIONS } from '../modules/auth/auth.permission';
import { MAIL_PERMISSIONS } from '../modules/mail/mail.permission';
import { ROLE_PERMISSIONS } from '../modules/user/role.permission';
import { USER_PERMISSIONS } from '../modules/user/user.permission';

export enum APP_PERMISSIONS {
  READ_STATUS = 'read_status',
  RESTART_APP = 'restart_app',
}

// Maybe a map might be a better choice here but for now we leave as object
export const ALL_PERMISSIONS = {
  USER_PERMISSIONS,
  ROLE_PERMISSIONS,
  MAIL_PERMISSIONS,
  AUTH_PERMISSIONS,
  APP_PERMISSIONS,
};
