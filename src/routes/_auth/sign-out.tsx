import { signOut } from '@/functions/auth/sign-out';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/sign-out')({
  preload: false,
  loader: () => signOut(),
});
