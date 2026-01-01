import { getSessionContext } from '@/functions/auth/get-session-context';
import { buildKey, getObject } from '@/lib/s3';
import { HttpStatus } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/organization/$organizationId/logo')({
  server: {
    handlers: {
      GET: async ({ params: { organizationId } }) => {
        const { organizations } = await getSessionContext();

        const isMember = organizations.some((org) => org.id === organizationId);
        if (!isMember) {
          console.log('not member');
          return new Response('', { status: HttpStatus.NotFound });
        }

        const key = buildKey(`organizations/${organizationId}/logo`);
        const logo = await getObject(key);
        if (!logo) {
          console.log('no logo');
          return new Response('', { status: HttpStatus.NotFound });
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
