import type { auth } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { HttpStatus } from '@/utils/http';
import {
  inferAdditionalFields,
  organizationClient,
} from 'better-auth/client/plugins';
import { createAuthClient, ErrorContext } from 'better-auth/react';

export const authClient = createAuthClient({
  fetchOptions: { onError },
  plugins: [inferAdditionalFields<typeof auth>(), organizationClient()],
});

async function onError({ request, response }: ErrorContext) {
  if (response.status === HttpStatus.TooManyRequests) {
    const retryAfter = response.headers.get('X-Retry-After');
    logger.error(
      `Rate limit exceeded for ${request.url}. Retry after ${retryAfter} seconds`,
    );
  }
}

export const {
  signIn,
  signUp,
  resetPassword,
  useSession,
  getSession,
  requestPasswordReset,
  deleteUser,
  updateUser,
  organization,
} = authClient;
