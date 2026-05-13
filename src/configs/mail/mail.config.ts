import configuration from '@configs/configuration';
import * as nodeMailer from 'nodemailer';

export const transporter = nodeMailer.createTransport({
  host: configuration().MAIL_HOST,
  port: configuration().MAIL_PORT,
  secure: true,
  auth: {
    user: configuration().MAIL_ADDRESS,
    pass: configuration().MAIL_PASSWORD,
  },
});
