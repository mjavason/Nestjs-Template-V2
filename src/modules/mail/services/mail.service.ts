import { SendMailDTO } from '@/modules/mail/validation/send-simple-mail.validation';
import configuration from '@configs/configuration';
import { APP_NAME } from '@configs/constants/constants';
import log from '@configs/logger/logger.config';
import { transporter } from '@configs/mail/mail.config';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import emailTemplates from '../templates/email.template';
import { baseTemplate } from './templates/base';
import { simpleMailContent } from './templates/base-content';

@Injectable()
export class MailService {
  constructor() {}
  async sendSimpleMail(dto: SendMailDTO) {
    const mailHtml = baseTemplate(
      dto.mailSubject,
      simpleMailContent(dto.recipientFirstName, dto.mailHtmlBody),
    );
    await this.sendMail(dto.recipientEmail, mailHtml, dto.mailSubject);

    return;
  }

  async sendWelcomeMail(recipientEmail: string, firstName: string) {
    const subject = `Welcome to ${APP_NAME}!`;
    const mailHtml = emailTemplates.welcome(firstName);

    await this.sendMail(recipientEmail, mailHtml, subject);
  }

  sendMail = async (
    recipientEmail: string,
    mailHtmlBody: string,
    mailSubject: string,
  ) => {
    if (configuration().SMTP_BRIDGE_PASSWORD) {
      return await this.sendMailViaSmtpBridge(
        recipientEmail,
        mailHtmlBody,
        mailSubject,
      );
    }

    log.info({
      context: `${MailService.name}#${this.sendMail.name}`,
      message: 'Sending mail via transporter',
      recipientEmail,
      subject: mailSubject,
      from: `${APP_NAME} <${configuration().MAIL_SENDER_FROM}>`,
    });

    await transporter.sendMail({
      from: `${APP_NAME} <${configuration().MAIL_SENDER_FROM}>`,
      to: recipientEmail,
      subject: mailSubject,
      html: mailHtmlBody,
    });
  };

  private sendMailViaSmtpBridge = async (
    recipientEmail: string,
    mailHtmlBody: string,
    mailSubject: string,
  ) => {
    log.info({
      context: `${MailService.name}#${this.sendMail.name}`,
      message: 'Sending mail via smtp bridge',
      recipientEmail,
      subject: mailSubject,
      app: APP_NAME,
    });

    //const smtpBridgeUrl = 'http://localhost:5001/send-mail';
    const smtpBridgeUrl = 'http://129.151.170.53:5001/send-mail';
    await axios.post(
      smtpBridgeUrl,
      {
        email: recipientEmail,
        subject: mailSubject,
        html: mailHtmlBody,
        app: APP_NAME,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${configuration().SMTP_BRIDGE_PASSWORD}`,
        },
      },
    );
  };
}
