import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const FilterUserSchema = z.object({
  authMethod: z.string().optional(),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  userName: z.string().optional(),
  isEmailVerified: z.coerce
    .boolean({ invalid_type_error: 'Invalid email verification status' })
    .optional(),
  isPhoneNumberVerified: z.coerce
    .boolean({ invalid_type_error: 'Invalid phone number verification status' })
    .optional(),
  phoneNumber: z.string().optional(),
  status: z.string().optional(),
  isSuper: z.coerce
    .boolean({ invalid_type_error: 'Invalid super user status' })
    .optional(),
  is2FAEnabled: z.coerce
    .boolean({ invalid_type_error: 'Invalid 2FA status' })
    .optional(),
  hasActiveSubscription: z.coerce
    .boolean({ invalid_type_error: 'Invalid subscription status' })
    .optional(),
  isAutoSubscriptionEnabled: z.coerce
    .boolean({ invalid_type_error: 'Invalid auto subscription status' })
    .optional(),
});

export class FilterUserDto extends createZodDto(FilterUserSchema) {}
