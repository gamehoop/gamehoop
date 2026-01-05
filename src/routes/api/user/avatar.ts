import { getUser } from '@/functions/auth/get-user';
import { getUserObject } from '@/lib/s3';
import { HttpStatus, notFound } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/user/avatar')({
  server: {
    handlers: {
      GET,
    },
  },
});

async function GET() {
  const user = await getUser();
  const avatar = await getUserObject({ userId: user.id, key: 'avatar' });
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
}
