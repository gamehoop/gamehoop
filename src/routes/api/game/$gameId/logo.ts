import { getSessionContext } from '@/functions/auth/get-session-context';
import { buildKey, getObject } from '@/lib/s3';
import { HttpStatus, notFound } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/game/$gameId/logo')({
  server: {
    handlers: {
      GET: async ({ params: { gameId } }) => {
        const { activeOrganization } = await getSessionContext();

        const key = buildKey(
          `organizations/${activeOrganization.id}/game/${gameId}/logo`,
        );
        const logo = await getObject(key);
        if (!logo) {
          return notFound();
        }

        const byteArray = await logo.transformToByteArray();
        const data = new Uint8Array(byteArray);

        return new Response(data, {
          // Cache for 100 days
          headers: { 'Cache-Control': 'max-age=8640000' },
          status: HttpStatus.Ok,
        });
      },
    },
  },
});
