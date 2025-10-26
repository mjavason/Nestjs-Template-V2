import { UserProfileOutput } from '@/modules/user/types/user-profile-output.type';
import { UserDocumentType } from '@common/models/user/user.schema';

export function transformUserProfile(
  user: UserDocumentType,
): UserProfileOutput {
  return {
    id: user._id.toString(),
    email: user.email,
    userName: user.userName,
    pictureUrl: user.pictureUrl,
    isEmailVerified: user.isEmailVerified,
    role: user.role,
    status: user.status,
    isSuper: user.isSuper,
    permissions: user.permissions,
    is2FAEnabled: user.is2FAEnabled,
    hasActiveSubscription: user.hasActiveSubscription,
    isAutoSubscriptionEnabled: user.isAutoSubscriptionEnabled,
  };
}
