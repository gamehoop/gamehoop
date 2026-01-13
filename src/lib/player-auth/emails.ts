import { sendEmail } from '@/lib/email';

export async function sendResetPassword({
  from,
  replyTo,
  user,
  url,
}: {
  from: string;
  replyTo?: string;
  user: { email: string };
  url: string;
}): Promise<void> {
  await sendEmail({
    from,
    to: user.email,
    replyTo,
    subject: 'Reset your password',
    html: `Click the link to reset your password: <a href="${url}">Reset Password</a>`,
  });
}

export async function sendVerificationEmail({
  from,
  replyTo,
  user,
  url,
}: {
  from: string;
  replyTo?: string;
  user: { email: string };
  url: string;
}): Promise<void> {
  await sendEmail({
    from,
    to: user.email,
    replyTo,
    subject: 'Verify your email address',
    html: `Click the link to verify your email: <a href="${url}">Verify Email</a>`,
  });
}

export async function sendChangeEmailConfirmation({
  from,
  replyTo,
  user,
  url,
}: {
  from: string;
  replyTo?: string;
  user: { email: string };
  url: string;
}): Promise<void> {
  await sendEmail({
    from,
    to: user.email,
    replyTo,
    subject: 'Approve your email change',
    html: `Click the link to approve the change: <a href="${url}">Approve Email</a>`,
  });
}
