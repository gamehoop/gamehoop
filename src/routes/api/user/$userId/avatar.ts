import { getActiveOrganization } from '@/functions/organization/get-active-organization';
import { getUserObject } from '@/lib/s3';
import { HttpStatus, notFound } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/user/$userId/avatar')({
  server: {
    handlers: {
      GET: async ({ params: { userId } }) => {
        const activeOrganization = await getActiveOrganization();

        const isMember = activeOrganization.members.find(
          (m) => m.userId === userId,
        );
        if (!isMember) {
          return notFound();
        }

        const avatar = await getUserObject({ userId, key: 'avatar' });
        if (!avatar) {
          return notFound();
        }

        const byteArray = await avatar.transformToByteArray();
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
