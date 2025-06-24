import * as z from 'zod';

// I am sure we will not be needing this
// function as I believe we will in most case parse our outputs manually to be sure
// and also write unit tests to guard them
export function stripToSchema<T>(schema: z.ZodType<T>, input: unknown): T {
  return schema.parse(input);
}
