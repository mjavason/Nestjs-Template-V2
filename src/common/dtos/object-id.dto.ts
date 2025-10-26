import { createZodDto } from '@anatine/zod-nestjs';
import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

export const objectIdSchema = z.string().refine((val) => isValidObjectId(val), {
  message: 'Invalid id',
});

export const objectIdParamSchema = z.object({
  id: objectIdSchema,
});

export type ObjectIdParamType = z.infer<typeof objectIdParamSchema>;
export class ObjectIdParamDto extends createZodDto(objectIdParamSchema) {}
