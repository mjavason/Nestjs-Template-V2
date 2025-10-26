import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const UpdateProfileSchema = z.object({
  userName: z.string().min(3).max(30).toLowerCase().optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character',
    )
    .optional(),
  is2FAEnabled: z.boolean().optional(),
  isAutoSubscriptionEnabled: z.boolean().optional(),
});

export class UpdateProfileDto extends createZodDto(UpdateProfileSchema) {}
