import { RoleDocumentType } from '@common/models/user/role.schema';
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
  role: string | Types.ObjectId | RoleDocumentType;
  status: string;
  isSuper: boolean;
  permissions: string[];
};
