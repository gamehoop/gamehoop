import { playerApiHandler } from '@/domain/api';
import { zPlayer } from '@/domain/api/schemas';
import { createPlayerAuth } from '@/libs/player-auth';
import { noContent, ok } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';
import { APIError } from 'better-auth';

export async function GET({
  params: { gameId },
  request,
}: {
  params: { gameId: string };
  request: Request;
}) {
  return playerApiHandler({ gameId, request }, async ({ player }) => {
    const data = zPlayer.parse(player);
    return ok(data);
  });
}

export async function DELETE({
  params: { gameId },
  request,
}: {
  params: { gameId: string };
  request: Request;
}) {
  return playerApiHandler({ gameId, request }, async ({ game, headers }) => {
    try {
      await createPlayerAuth(game).deleteUser({
        body: {},
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

export const Route = createFileRoute('/api/v1/games/$gameId/player/')({
  server: {
    handlers: {
      GET,
      DELETE,
    },
  },
});
