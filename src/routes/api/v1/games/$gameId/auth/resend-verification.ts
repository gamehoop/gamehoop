import { gameApiHandler, parseJson } from '@/domain/api';
import { createPlayerAuth } from '@/lib/player-auth';
import { playerStore } from '@/stores/player-store';
import { badRequest, ok } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

const zReqBody = z.object({ email: z.email() });

export const Route = createFileRoute(
  '/api/v1/games/$gameId/auth/resend-verification',
)({
  server: {
    handlers: {
      POST: async ({ params: { gameId }, request }) => {
        return gameApiHandler({ gameId, request }, async ({ game }) => {
          const { email } = await parseJson(request, zReqBody);

          const player = await playerStore.findOne({ where: { email } });
          if (!player) {
            return badRequest({
              error: 'A player with that email does not exist.',
            });
          }

          const playerAuth = createPlayerAuth(game);
          await playerAuth.sendVerificationEmail({
            body: {
              email,
              callbackURL: `/games/${game.id}/auth/email-verified`,
            },
          });

          return ok();
        });
      },
    },
  },
});
