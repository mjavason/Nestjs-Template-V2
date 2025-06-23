import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const errorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  errors: z.array(z.string()).optional(),
});

export type ErrorResponseSchema = z.infer<typeof errorResponseSchema>;
export class ErrorResponseDTO extends createZodDto(errorResponseSchema) {}
