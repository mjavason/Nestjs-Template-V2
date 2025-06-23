/**
 * this are the outputs for auth
 */

import { createZodDto } from '@anatine/zod-nestjs';
import { createSuccessResponseSchema } from '@common/types/responses/success.type';
import { z } from 'zod';

export const authSignupOutputSchema = z.object({
  id: z.string(),
  email: z.string(),
  token: z.string(),
});

export type AuthSignupOutput = z.infer<typeof authSignupOutputSchema>;
const successSchema = createSuccessResponseSchema(authSignupOutputSchema);
export const AuthSignupOutputDto = createZodDto(successSchema);
