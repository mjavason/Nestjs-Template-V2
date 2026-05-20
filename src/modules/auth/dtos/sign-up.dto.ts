import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const signUpSchema = z.object({
  firstName: z.string({ message: 'First name is required' }).trim(),
  lastName: z.string({ message: 'Last name is required' }).trim(),
  email: z
    .string({ message: 'Email is required' })
    .email({ message: 'Invalid email format' })
    .toLowerCase(),
  password: z
    .string({ message: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /(?=.*\d)(?=.*\W)/,
      'Password must contain a number and special character',
    )
    .trim(),
});

export type SignUpInputType = z.infer<typeof signUpSchema>;
export class SignUpDto extends createZodDto(signUpSchema) {}
