import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const TwoFactorDtoSchema = z.object({
  email: z.string().email(),
  code: z.string().regex(/^\d{5}$/, 'Code must be a 5-digit number'),
});

export class Verify2FADto extends createZodDto(TwoFactorDtoSchema) {}
