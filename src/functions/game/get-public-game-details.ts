import { gameRepo } from '@/repos/game-repo';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

const zPublicGameDetails = z.object({
  id: z.uuid(),
  name: z.string(),
  logo: z.string().nullable(),
});

export const getPublicGameDetails = createServerFn()
  .inputValidator(z.object({ gameId: z.string() }))
  .handler(
    async ({
      data: { gameId },
    }): Promise<z.infer<typeof zPublicGameDetails>> => {
      const game = await gameRepo.findOne({
        where: { id: gameId },
      });
      if (!game) {
        throw notFound();
      }

      return zPublicGameDetails.parse(game);
    },
  );
