import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce
    .number({ invalid_type_error: 'page must be a valid number' })
    .int({ message: 'page must be an integer' })
    .min(1, { message: 'page must be at least 1' })
    .default(1)
    .catch(1),
  limit: z.coerce
    .number({ invalid_type_error: 'limit must be a valid number' })
    .int({ message: 'limit must be an integer' })
    .min(1, { message: 'limit must be at least 1' })
    .default(50)
    .catch(50),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
export class PaginationQueryDto extends createZodDto(paginationSchema) {}
