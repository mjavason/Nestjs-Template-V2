import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const signUpSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email format' })
    .toLowerCase(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /(?=.*\d)(?=.*\W)/,
      'Password must contain a number and special character',
    )
    .trim(),
});

export type SignUpInputType = z.infer<typeof signUpSchema>;
export class SignUpDto extends createZodDto(signUpSchema) {}
