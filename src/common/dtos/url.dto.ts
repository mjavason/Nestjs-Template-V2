import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const urlParamSchema = z.object({
  url: z
    .string({
      required_error: 'url is required',
      invalid_type_error: 'url must be a string',
    })
    .url('url must be a valid URL'),
});

export type urlParamType = z.infer<typeof urlParamSchema>;
export class urlParamDto extends createZodDto(urlParamSchema) {}
