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

    throw redirect({
      to: `/games/$gameId/players`,
      params: { gameId: activeGame.publicId },
    });
  },
});
