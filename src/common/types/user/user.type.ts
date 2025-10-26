import { RoleDocumentType } from '@common/models/user/role.schema';

export type UserType = {
  authMethod: string;
  email: string;
  password: string;
  userName: string;
  pictureUrl: string;
  isEmailVerified: boolean;
  roleId: string;
  role?: RoleDocumentType; //virtual
  permissions: string[];
  status: string;
  isSuper: boolean;
  is2FAEnabled: boolean;
  hasActiveSubscription: boolean;
  isAutoSubscriptionEnabled: boolean;
};
