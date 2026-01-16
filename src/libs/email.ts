import { env } from '@/env/server';
import { createTransport } from 'nodemailer';

const transporter = createTransport({
  host: env.SMTP_SERVER,
  port: env.SMTP_PORT,
  auth: {
    user: env.SMTP_USERNAME,
    pass: env.SMTP_PASSWORD,
  },
});

export function sendEmail({
  to,
  subject,
  html,
  from = `Gamehoop <${env.SMTP_SENDER}>`,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}) {
  return transporter.sendMail({
    from,
    to,
    replyTo,
    subject,
    html,
  });
}
