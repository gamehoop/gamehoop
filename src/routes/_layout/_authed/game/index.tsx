import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/_authed/game/')({
  beforeLoad: async ({
    context: {
      activeOrganization: { activeGame },
    },
  }) => {
    if (!activeGame) {
      throw redirect({ to: '/' });
    }

    throw redirect({
      to: `/game/$gameId`,
      params: { gameId: activeGame.publicId },
    });
  },
});
