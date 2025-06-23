import configuration from '@configs/configuration';
import * as nodeMailer from 'nodemailer';

export const transporter = nodeMailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: configuration().MAIL_ADDRESS,
    pass: configuration().MAIL_PASSWORD,
  },
});
