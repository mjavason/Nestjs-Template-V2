import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const requestPhoneNumberVerificationSchema = z.object({
  phone: z.string({ message: 'Phone number is required' }),
});

export type RequestPhoneNumberVerificationInputType = z.infer<
  typeof requestPhoneNumberVerificationSchema
>;
export class RequestPhoneNumberVerificationDto extends createZodDto(
  requestPhoneNumberVerificationSchema,
) {}
