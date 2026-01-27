import { adminApiHandler, parseParams } from '@/domain/api';
import { zPage, zPlayer } from '@/domain/api/schemas';
import { Scope } from '@/domain/game-api-key';
import { playerRepo } from '@/repos/player-repo';
import { ok } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

const zReqParams = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(20),
  sortBy: z
    .enum(['createdAt', 'lastLoginAt', 'name', 'email'])
    .default('createdAt'),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
  name: z.string().optional(),
  email: z.string().optional(),
});

const zResBody = zPage(zPlayer);

export async function GET({
  params: { gameId },
  request,
}: {
  params: { gameId: string };
  request: Request;
}) {
  return adminApiHandler(
    { gameId, request, scopes: [Scope.ReadPlayers] },
    async ({ game }) => {
      const { page, pageSize, sortBy, sortDir, name, email } = parseParams(
        request,
        zReqParams,
      );

      const total = await playerRepo.count({
        where: { gameId: game.id, name, email },
      });

      const players = await playerRepo.findMany({
        where: { gameId: game.id, name, email },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [sortBy]: sortDir },
      });

      const totalPages = Math.ceil(total / pageSize);

      const data = zResBody.parse({
        data: players,
        total,
        page,
        pageSize,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      });

      return ok(data);
    },
  );
}

export const Route = createFileRoute('/api/v1/admin/games/$gameId/players/')({
  server: {
    handlers: {
      GET,
    },
  },
});
