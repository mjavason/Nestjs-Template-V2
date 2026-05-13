import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const UpdateProfileAdminSchema = z.object({
  hasActiveSubscription: z.boolean().optional(),
});

export class UpdateProfileAdminDto extends createZodDto(
  UpdateProfileAdminSchema,
) {}
