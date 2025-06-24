import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const signUpSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  firstName: z
    .string({ required_error: 'First name is required' })
    .min(3, { message: 'First name is required' }),
  lastName: z
    .string({ required_error: 'Last name is required' })
    .min(3, { message: 'Last name is required' }),
  phoneNumber: z
    .string({ required_error: 'Phone number is required' })
    .min(11, { message: 'Phone number must be at least 11 characters' })
    .max(15, { message: 'Phone number must be at most 15 characters' }),
  role: z
    .string({ required_error: 'Role is required' })
    .regex(/^[0-9a-fA-F]{24}$/, { message: 'Role must be a valid ObjectId' }),
  pictureUrl: z
    .string()
    .url({ message: 'Picture URL must be a valid URL' })
    .optional(),
});

export type SignUpInputType = z.infer<typeof signUpSchema>;
export class SignUpDto extends createZodDto(signUpSchema) {}
