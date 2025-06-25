import { UserDocumentType } from '@common/models/user.schema';
import { UserProfileOutput } from '../types/user-profile-output.type';

export function transformUserProfile(
  user: UserDocumentType,
): UserProfileOutput {
  return {
    id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    username: user.username,
    pictureUrl: user.pictureUrl,
    isEmailVerified: user.isEmailVerified,
    isPhoneNumberVerified: user.isPhoneNumberVerified,
    role: {
      name: user.role?.name,
    },
    status: user.status,
    isSuper: user.isSuper,
    permissions: user.permissions,
  };
}
