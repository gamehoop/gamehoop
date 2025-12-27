import { auth } from '@/lib/auth';
import { createFileRoute } from '@tanstack/react-router';

// Let better-auth handle the authentication API requests
export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: ({ request }) => auth.handler(request),
      POST: ({ request }) => auth.handler(request),
    },
  },
});
