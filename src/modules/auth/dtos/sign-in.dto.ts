import { createZodDto } from '@anatine/zod-nestjs';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(3, { message: 'Password must not be empty' }),
});

export class LoginDto extends createZodDto(loginSchema) {
  @ApiProperty({
    example: 'testerzero@gmail.com',
  })
  email: string;

  @ApiProperty({
    example: 'Strong@password123',
  })
  password: string;
}
