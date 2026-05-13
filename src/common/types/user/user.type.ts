import { RoleDocumentType } from '@common/models/user/role.schema';

export type UserType = {
  firstName: string;
  lastName: string;
  authMethod: string;
  email: string;
  isEmailVerified: boolean;
  phoneNumber: string | null;
  isPhoneNumberVerified: boolean;
  password: string;
  userName: string;
  pictureUrl: string;

  roleId: string;
  role?: RoleDocumentType; //virtual
  permissions: string[];
  status: string;
  isSuper: boolean;
  is2FAEnabled: boolean;
  hasActiveSubscription: boolean;
  isAutoSubscriptionEnabled: boolean;
  userType: string;
};
