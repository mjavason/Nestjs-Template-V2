import { RoleDocumentType } from '@common/models/role.schema';
import { Types } from 'mongoose';

export type UserType = {
  authMethod: string;
  email: string;
  firstName: string;
  fullName?: string; //virtual field combining firstName and lastName
  lastName: string;
  username: string;

  pictureUrl: string;
  isEmailVerified: boolean;
  isPhoneNumberVerified: boolean;
  password: string;
  phoneNumber: string;
  roleId: string | Types.ObjectId;
  role?: RoleDocumentType | null;
  status: string;
  isSuper: boolean;
  permissions: string[];
};
