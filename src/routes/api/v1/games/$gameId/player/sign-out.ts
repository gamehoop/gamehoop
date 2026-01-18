import { playerApiHandler } from '@/domain/api';
import { createPlayerAuth } from '@/libs/player-auth';
import { noContent } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';
import { APIError } from 'better-auth';

export async function DELETE({
  params: { gameId },
  request,
}: {
  params: { gameId: string };
  request: Request;
}) {
  return playerApiHandler({ gameId, request }, async ({ game, headers }) => {
    try {
      await createPlayerAuth(game).signOut({
        headers,
      });
      return noContent();
    } catch (error) {
      if (error instanceof APIError) {
        return Response.json(
          { error: error.message },
          { status: error.statusCode },
        );
      }

      throw error;
    }
  });
}

export const Route = createFileRoute('/api/v1/games/$gameId/player/sign-out')({
  server: {
    handlers: {
      DELETE,
    },
  },
});
