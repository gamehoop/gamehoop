import { Title } from '@/components/ui/title';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/_authed/players/')({
  beforeLoad: async ({
    context: {
      activeOrganization: { activeGame },
    },
  }) => {
    if (!activeGame) {
      throw redirect({ to: '/' });
    }
  },
  component: Players,
});

function Players() {
  return (
    <div>
      <Title order={2}>Players</Title>
    </div>
  );
}
