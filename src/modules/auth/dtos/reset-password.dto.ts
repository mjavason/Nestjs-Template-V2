import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const resetPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  token: z
    .string({ required_error: 'Token is required' })
    .length(5, { message: 'Token must be exactly 5 digits' })
    .regex(/^\d{5}$/, { message: 'Token must be a 5-digit number' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /(?=.*\d)(?=.*\W)/,
      'Password must contain a number and special character',
    ),
});

export type ResetPasswordInputType = z.infer<typeof resetPasswordSchema>;
export class ResetPasswordDto extends createZodDto(resetPasswordSchema) {}
