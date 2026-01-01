import { Title } from '@/components/ui/title';
import { useSessionContext } from '@/hooks/use-session-context';
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
  const { user } = useSessionContext();

  return (
    <div>
      <Title order={2}>
        {getGreeting()}, {user.name}
      </Title>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good morning';
  } else if (hour < 18) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
}
