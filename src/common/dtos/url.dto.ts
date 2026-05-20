import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const urlParamSchema = z.object({
  url: z
    .string({
      message: 'url is required',
    })
    .url('url must be a valid URL'),
});

export type urlParamType = z.infer<typeof urlParamSchema>;
export class urlParamDto extends createZodDto(urlParamSchema) {}
