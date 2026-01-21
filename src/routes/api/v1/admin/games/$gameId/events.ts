import { adminApiHandler, parseParams } from '@/domain/api';
import { zGameEvent, zPage } from '@/domain/api/schemas';
import { gameEventRepo } from '@/repos/game-event-repo';
import { ok } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

const zReqParams = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(20),
  sortBy: z.enum(['name', 'timestamp', 'createdAt']).default('timestamp'),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
  playerId: z.string().optional(),
  sessionId: z.string().optional(),
  deviceId: z.string().optional(),
});

const zResBody = zPage(zGameEvent);

export async function GET({
  params: { gameId },
  request,
}: {
  params: { gameId: string };
  request: Request;
}) {
  return adminApiHandler({ gameId, request }, async ({ game }) => {
    const { page, pageSize, sortBy, sortDir, playerId, sessionId, deviceId } =
      parseParams(request, zReqParams);

    const { total, items } = await gameEventRepo.page({
      where: { gameId: game.id, playerId, sessionId, deviceId },
      orderBy: { [sortBy]: sortDir },
      page,
      pageSize,
    });

    const totalPages = Math.ceil(total / pageSize);

    const data = zResBody.parse({
      data: items,
      total,
      page,
      pageSize,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });

    return ok(data);
  });
}

export const Route = createFileRoute('/api/v1/admin/games/$gameId/events')({
  server: {
    handlers: {
      GET,
    },
  },
});
