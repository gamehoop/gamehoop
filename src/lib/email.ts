import { env } from '@/env/server';
import { createTransport } from 'nodemailer';

const transporter = createTransport({
  host: env.SMTP_SERVER,
  port: Number(env.SMTP_PORT),
  auth: {
    user: env.SMTP_USERNAME,
    pass: env.SMTP_PASSWORD,
  },
});

export function sendEmail({
  to,
  subject,
  html,
  from = env.SMTP_SENDER,
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  return transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
}
