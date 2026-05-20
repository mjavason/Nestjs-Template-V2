import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const updateSystemSettingsSchema = z.object({
  language: z
    .string({
      required_error: 'Language is required',
      invalid_type_error: 'Language must be a string',
    })
    .optional(),
});

export class UpdateSystemSettingsDto extends createZodDto(
  updateSystemSettingsSchema,
) {}
