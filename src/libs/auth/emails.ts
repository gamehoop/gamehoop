import { env } from '@/env/client';
import { sendEmail } from '@/libs/email';

export async function sendResetPassword({
  user,
  url,
}: {
  user: { email: string };
  url: string;
}): Promise<void> {
  await sendEmail({
    to: user.email,
    subject: 'Reset your password',
    html: `Click the link to reset your password: <a href="${url}">Reset Password</a>`,
  });
}

export async function sendVerificationEmail({
  user,
  url,
}: {
  user: { email: string };
  url: string;
}): Promise<void> {
  await sendEmail({
    to: user.email,
    subject: 'Verify your email address',
    html: `Click the link to verify your email: <a href="${url}">Verify Email</a>`,
  });
}

export async function sendChangeEmailConfirmation({
  user,
  url,
}: {
  user: { email: string };
  url: string;
}): Promise<void> {
  await sendEmail({
    to: user.email,
    subject: 'Approve your email change',
    html: `Click the link to approve the change: <a href="${url}">Approve Email</a>`,
  });
}

export async function sendDeleteAccountVerification({
  user,
  url,
}: {
  user: { email: string };
  url: string;
}): Promise<void> {
  await sendEmail({
    to: user.email,
    subject: 'Confirm your account deletion',
    html: `Click the link to confirm you want to delete your account: <a href="${url}">Delete Account</a>`,
  });
}

export async function sendInvitationEmail({
  id,
  email,
  inviter,
}: {
  id: string;
  email: string;
  inviter: { user: { name: string } };
}): Promise<void> {
  const url = `${env.VITE_BASE_URL}/invitation/${id}/accept?email=${encodeURIComponent(email)}`;
  await sendEmail({
    to: email,
    subject: `${inviter.user.name} has invited you to join Gamehoop`,
    html: `Click the link to join Gamehoop: <a href="${url}">Accept Invitation</a>`,
  });
}
