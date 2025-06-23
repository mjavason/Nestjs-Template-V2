import { createZodDto } from '@anatine/zod-nestjs';
import { createSuccessResponseSchema } from '@common/types/responses/success.type';
import { z } from 'zod';

export const userProfileOutputSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  fullName: z.string().optional(),
  username: z.string().optional(),
  pictureUrl: z.string().optional(),
  isEmailVerified: z.boolean(),
  isPhoneNumberVerified: z.boolean(),
  role: z.object({ name: z.string() }),
  status: z.string(),
  isSuper: z.boolean(),
  permissions: z.array(z.string()),
});

const successResponseSchema = createSuccessResponseSchema(
  userProfileOutputSchema,
);
export const UserProfileOutputDto = createZodDto(successResponseSchema);
