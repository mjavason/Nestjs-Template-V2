import { UserDocumentType } from '@common/models/user/user.schema';
import { AuthSignupOutputData } from '../types/auth-outputs.types';

export function transformAuthSignup(
  user: UserDocumentType,
  token: string,
): AuthSignupOutputData {
  return {
    id: user.id,
    email: user.email,
    isEmailVerified: user.isEmailVerified,
    userName: user.userName,
    token,
    userType: user.userType,
  };
}
