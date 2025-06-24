import { z } from 'zod';

export const MulterFileSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string(),
  size: z.number(),
  buffer: z.instanceof(Buffer),
  destination: z.string().optional(),
  filename: z.string().optional(),
  path: z.string().optional(),
});

export type MulterFileType = z.infer<typeof MulterFileSchema>;
