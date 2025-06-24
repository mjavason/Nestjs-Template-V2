import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(3, { message: 'Password must not be empty' }),
});

export type LoginInputType = z.infer<typeof loginSchema>;
export class LoginDto extends createZodDto(loginSchema) {}
