import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const setPasswordSchema = z.object({
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /(?=.*\d)(?=.*\W)/,
      'Password must contain a number and special character',
    ),
});

export type SetPasswordInputType = z.infer<typeof setPasswordSchema>;
export class SetPasswordDto extends createZodDto(setPasswordSchema) {}
