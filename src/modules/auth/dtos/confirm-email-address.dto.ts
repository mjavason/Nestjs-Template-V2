import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const confirmEmailSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  token: z
    .string({ required_error: 'Token is required' })
    .length(6, { message: 'Token must be exactly 6 digits' })
    .regex(/^\d{6}$/, { message: 'Token must be a 6-digit number' }),
});

export type ConfirmEmailInputType = z.infer<typeof confirmEmailSchema>;
export class ConfirmEmailDto extends createZodDto(confirmEmailSchema) {}
