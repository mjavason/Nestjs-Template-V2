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

    this.sendMail(
      dto.recipientEmail,
      baseTemplate(dto.recipientFirstName, sanitizedHTML),
      dto.mailSubject,
    );

    log.info({
      context: `${MailService.name}#${this.sendSimpleMail.name}`,
      message: 'New Simple Email Sent',
      data: dto,
    });
    return;
  }

  private sendMail = (
    recipientEmail: string,
    mailHtmlBody: string,
    mailSubject: string,
  ) => {
    void transporter.sendMail({
      from: `Startup <${configuration().MAIL_ADDRESS}>`,
      to: recipientEmail,
      subject: mailSubject,
      html: mailHtmlBody,
    });
  };
}
