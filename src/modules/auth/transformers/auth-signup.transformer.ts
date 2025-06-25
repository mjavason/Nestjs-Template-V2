import { UserDocumentType } from '@common/models/user.schema';
import { AuthSignupOutput } from '../types/auth-outputs.types';

export function transformAuthSignup(
  user: UserDocumentType,
  token: string,
): AuthSignupOutput {
  return {
    id: user.id,
    email: user.email,
    token,
  };
}
