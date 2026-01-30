import { gameEventRepo } from '@/repos/game-event-repo';
import { gameRepo } from '@/repos/game-repo';
import { HttpMethod } from '@/utils/http';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { getUser } from '../../auth/get-user';

export const deleteGameEvent = createServerFn({ method: HttpMethod.Post })
  .inputValidator(z.object({ gameId: z.string(), eventId: z.string() }))
  .handler(async ({ data: { gameId, eventId } }): Promise<void> => {
    const user = await getUser();
    const game = await gameRepo.findOneForUser({
      userId: user.id,
      where: { id: gameId },
    });
    if (!game) {
      throw notFound();
    }

    await gameEventRepo.delete({ where: { id: eventId } });
  });
