import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

export const Route = createFileRoute('/_layout/_authed/')({
  validateSearch: z.object({
    verified: z.boolean().optional(),
    accountDeleted: z.boolean().optional(),
    invitationAccepted: z.boolean().optional(),
    error: z.string().optional(),
  }),
  component: Home,
});

function Home() {
  return <div></div>;
}
