import configuration from '@configs/configuration';
import { transporter } from '@configs/mail/mail.config';
import { Injectable } from '@nestjs/common';
import * as sanitizeHtml from 'sanitize-html';
import { SendMailDTO } from '../validation/send-simple-mail.validation';
import { baseTemplate } from './templates/base';

@Injectable()
export class MailService {
  constructor() {}
  async sendSimpleMail(dto: SendMailDTO) {
    const sanitizedHTML = sanitizeHtml(dto.mailHtmlBody);

    await this.sendMail(
      dto.recipientEmail,
      baseTemplate(dto.recipientFirstName, sanitizedHTML),
      dto.mailSubject,
    );

    log.info({
      context: `${MailService.name}#sendSimpleMail`,
      message: 'New Simple Email Sent',
      data: dto,
    });
    return;
  }

  private sendMail = async (
    recipientEmail: string,
    mailHtmlBody: string,
    mailSubject: string,
  ) => {
    // This is where the actual email message is built. Things like CC, recipients, attachments, and so on are configured here.
    return await transporter.sendMail({
      from: `Startup <${configuration().MAIL_ADDRESS}>`,
      to: recipientEmail,
      subject: mailSubject,
      html: mailHtmlBody,
    });
  };
}
