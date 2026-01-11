import { Title } from '@/components/ui/title';
import { env } from '@/env/client';
import { useSessionContext } from '@/hooks/use-session-context';
import { seo } from '@/utils/seo';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

export const Route = createFileRoute('/_layout/_authed/')({
  loader: async ({
    context: {
      activeOrganization: { activeGame },
    },
  }) => {
    return { activeGame };
  },
  head: ({ loaderData }) => {
    let title = `Home | ${env.VITE_APP_NAME}`;
    if (loaderData?.activeGame) {
      title = `Home | ${loaderData?.activeGame?.name} | ${env.VITE_APP_NAME}`;
    }
    return {
      meta: seo({ title }),
    };
  },
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
