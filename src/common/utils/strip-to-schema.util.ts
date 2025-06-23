import * as z from 'zod';

export function stripToSchema<T>(schema: z.ZodType<T>, input: unknown): T {
  return schema.parse(input);
}
