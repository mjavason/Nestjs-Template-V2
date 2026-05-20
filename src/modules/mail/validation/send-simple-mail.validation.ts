import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const sendMailSchema = z.object({
  recipientFirstName: z
    .string({
      message: 'Recipient first name is required',
    })
    .min(3, 'Recipient first name must be at least 3 characters')
    .max(50, 'Recipient first name must not exceed 50 characters'),

  recipientEmail: z
    .string({
      message: 'Recipient email is required',
    })
    .min(5, 'Recipient email must be at least 5 characters')
    .max(320, 'Recipient email must not exceed 320 characters')
    .email('Invalid email format'),

  mailHtmlBody: z
    .string({
      message: 'Email HTML body is required',
    })
    .min(3, 'Email body must not be empty')
    .max(100000, 'Email body too long'),

  mailSubject: z
    .string({
      message: 'Email subject is required',
    })
    .min(3, 'Subject must not be empty')
    .max(998, 'Subject exceeds RFC limit'),
});

export type SendMailSchema = z.infer<typeof sendMailSchema>;
export class SendMailDTO extends createZodDto(sendMailSchema) {}
