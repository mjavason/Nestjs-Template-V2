import { AuthSignupOutput } from '@/modules/auth/types/auth-outputs.types';
import { UserDocumentType } from '@common/models/user/user.schema';

export function transformAuthSignup(
  user: UserDocumentType,
  token: string,
): AuthSignupOutput {
  return {
    id: user.id,
    email: user.email,
    isEmailVerified: user.isEmailVerified,
    userName: user.userName,
    token,
  };
}
