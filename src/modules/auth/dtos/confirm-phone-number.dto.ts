import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const confirmPhoneNumberSchema = z.object({
  phoneNumber: z
    .string({ required_error: 'Phone number is required' })
    .min(11, { message: 'Phone number must be at least 11 characters' })
    .max(15, { message: 'Phone number must be at most 15 characters' }),
  token: z
    .string({ required_error: 'Token is required' })
    .length(6, { message: 'Token must be exactly 6 digits' })
    .regex(/^\d{6}$/, { message: 'Token must be a 6-digit number' }),
});

export type ConfirmPhoneNumberInputType = z.infer<
  typeof confirmPhoneNumberSchema
>;
export class ConfirmPhoneNumberDto extends createZodDto(
  confirmPhoneNumberSchema,
) {}
