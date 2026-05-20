import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const socialSignUpSchema = z.object({
  token: z.string({ message: 'Id token is required' }),
  provider: z.enum(['google.com'], {
    message: 'Social provider is required',
  }),
});

export type SocialSignUpType = z.infer<typeof socialSignUpSchema>;
export class SocialSignUpDto extends createZodDto(socialSignUpSchema) {}
