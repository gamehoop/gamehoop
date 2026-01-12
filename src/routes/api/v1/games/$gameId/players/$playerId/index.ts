import { withPlayerAccess } from '@/domain/api';
import { ok } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

const zResBody = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  gameId: z.string(),
  image: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export async function GET({
  params: { gameId, playerId },
  request,
}: {
  params: { gameId: string; playerId: string };
  request: Request;
}) {
  return withPlayerAccess({ gameId, playerId, request }, async ({ player }) => {
    const data = zResBody.parse({
      ...player,
      createdAt: player.createdAt.toISOString(),
      updatedAt: player.updatedAt.toISOString(),
    });
    return ok(data);
  });
}

export const Route = createFileRoute(
  '/api/v1/games/$gameId/players/$playerId/',
)({
  server: {
    handlers: {
      GET,
    },
  },
});
