import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email format' }),
});

export type ForgotPasswordInputType = z.infer<typeof forgotPasswordSchema>;
export class ForgotPasswordDto extends createZodDto(forgotPasswordSchema) {}
