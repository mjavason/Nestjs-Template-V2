import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const requestEmailVerificationSchema = z.object({
  email: z
    .string({ message: 'Email is required' })
    .email({ message: 'Invalid email format' }),
});

export type RequestEmailVerificationInputType = z.infer<
  typeof requestEmailVerificationSchema
>;
export class RequestEmailVerificationDto extends createZodDto(
  requestEmailVerificationSchema,
) {}
