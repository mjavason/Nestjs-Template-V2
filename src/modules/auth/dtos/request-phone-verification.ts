import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const requestPhoneNumberVerificationSchema = z.object({
  phone: z.string({ required_error: 'Phone number is required' }),
});

export type RequestPhoneNumberVerificationInputType = z.infer<
  typeof requestPhoneNumberVerificationSchema
>;
export class RequestPhoneNumberVerificationDto extends createZodDto(
  requestPhoneNumberVerificationSchema,
) {}
