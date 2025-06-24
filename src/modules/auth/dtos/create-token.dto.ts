import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const createTokenSchema = z.object({
  userId: z
    .string({ required_error: 'User ID is required' })
    .regex(/^[0-9a-fA-F]{24}$/, { message: 'User must be a valid ObjectId' }),
  type: z
    .string({ required_error: 'Type is required' })
    .min(3, { message: 'Type must not be empty' }),
  token: z
    .string({ required_error: 'Token is required' })
    .min(3, { message: 'Token must not be empty' }),
});

export type CreateTokenInputType = z.infer<typeof createTokenSchema>;
export class CreateTokenDto extends createZodDto(createTokenSchema) {}
