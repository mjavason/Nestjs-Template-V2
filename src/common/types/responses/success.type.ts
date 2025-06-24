import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const paginationSchema = z.object({
  hasNextPage: z.boolean(),
  totalPages: z.number(),
  totalCount: z.number(),
  nextPage: z.number().nullable(),
  hasPreviousPage: z.boolean(),
});

export const SimpleSuccessResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const createSuccessResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T,
) =>
  z.object({
    success: z.boolean({
      required_error: 'Success flag is required',
      invalid_type_error: 'Success must be a boolean',
    }),
    message: z.string({
      required_error: 'Message is required',
      invalid_type_error: 'Message must be a string',
    }),
    data: dataSchema,
  });

export const successResponseSchema = createSuccessResponseSchema(z.unknown());

export type PaginationType = z.infer<typeof paginationSchema>;
export class SuccessResponseDTO extends createZodDto(successResponseSchema) {}
export class SimpleSuccessResponseDTO extends createZodDto(
  SimpleSuccessResponseSchema,
) {}
