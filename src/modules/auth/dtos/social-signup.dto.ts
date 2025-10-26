import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const socialSignUpSchema = z.object({
  token: z.string({ required_error: 'Id token is required' }),
  provider: z.enum(['google.com'], {
    required_error: 'Social provider is required',
  }),
});

export type SocialSignUpType = z.infer<typeof socialSignUpSchema>;
export class SocialSignUpDto extends createZodDto(socialSignUpSchema) {}
