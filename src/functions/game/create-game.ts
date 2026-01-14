import { Game } from '@/db/types';
import { auth } from '@/libs/auth';
import { gameRepo } from '@/repos/game-repo';
import { HttpMethod } from '@/utils/http';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import z from 'zod';
import { getSessionContext } from '../auth/get-session-context';

export const createGame = createServerFn({
  method: HttpMethod.Post,
})
  .inputValidator(
    z.object({
      name: z.string().min(1),
      genre: z.string().optional(),
      platforms: z.array(z.string()).optional(),
      sdk: z.string().optional(),
    }),
  )
  .handler(async ({ data: { name, genre, platforms, sdk } }): Promise<Game> => {
    const { user, activeOrganization } = await getSessionContext();

    const game = await gameRepo.create({
      name,
      genre,
      platforms,
      sdk,
      organizationId: activeOrganization.id,
      createdBy: user.id,
      updatedBy: user.id,
    });

    await auth.api.updateUser({
      body: {
        settings: {
          ...user.settings,
          activeGameId: game.id,
        },
      },
      headers: getRequestHeaders(),
    });

    return game;
  });
