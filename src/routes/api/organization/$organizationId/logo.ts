import { getSessionContext } from '@/functions/auth/get-session-context';
import { buildKey, getObject } from '@/lib/s3';
import { HttpStatus, notFound } from '@/utils/http';
import { createFileRoute } from '@tanstack/react-router';

export async function GET({
  params: { organizationId },
}: {
  params: { organizationId: string };
}) {
  const { organizations } = await getSessionContext();

  const isMember = organizations.some((org) => org.id === organizationId);
  if (!isMember) {
    return notFound();
  }

  const key = buildKey(`organizations/${organizationId}/logo`);
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
}

export const Route = createFileRoute('/api/organization/$organizationId/logo')({
  server: {
    handlers: {
      GET,
    },
  },
});
