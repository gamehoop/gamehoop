import { parseJson, parseParams, playerApiHandler } from '@/domain/api';
import { zGameEvent, zGameEventProperties, zPage } from '@/domain/api/schemas';
import { gameEventRepo } from '@/repos/game-event-repo';
import { created, ok } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

const zPostReqBody = z.object({
  name: z.string(),
  properties: zGameEventProperties.optional(),
  sessionId: z.string().optional(),
  deviceId: z.string().optional(),
  timestamp: z.iso.datetime().transform((str) => new Date(str)),
});

export async function POST({
  params: { gameId },
  request,
}: {
  params: { gameId: string };
  request: Request;
}) {
  return playerApiHandler({ gameId, request }, async ({ player }) => {
    const body = await parseJson(request, zPostReqBody);
    const event = await gameEventRepo.create({
      ...body,
      gameId,
      playerId: player.id,
    });
    return created(event);
  });
}

const zGetReqParams = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(20),
  sortBy: z.enum(['name', 'timestamp']).default('timestamp'),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
});

const zGetResBody = zPage(zGameEvent);

export async function GET({
  params: { gameId },
  request,
}: {
  params: { gameId: string };
  request: Request;
}) {
  return playerApiHandler({ gameId, request }, async ({ game }) => {
    const { page, pageSize, sortBy, sortDir } = parseParams(
      request,
      zGetReqParams,
    );

    const total = await gameEventRepo.count({ where: { id: game.id } });

    const events = await gameEventRepo.findMany({
      where: { gameId: game.id },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortDir },
    });

    const totalPages = Math.ceil(total / pageSize);

    const data = zGetResBody.parse({
      data: events,
      total,
      page,
      pageSize,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });

    return ok(data);
  });
}

export const Route = createFileRoute('/api/v1/games/$gameId/events/')({
  server: {
    handlers: {
      GET,
      POST,
    },
  },
});
