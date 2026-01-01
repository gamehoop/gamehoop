import { auth } from '@/lib/auth';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { getSessionContext } from '../auth/get-session-context';

export const getActiveOrganization = createServerFn().handler(async () => {
  const { user, activeOrganization } = await getSessionContext();

  const organization = await auth.api.getFullOrganization({
    query: {
      organizationId: activeOrganization.id,
    },
    headers: getRequestHeaders(),
  });

  if (!organization) {
    throw new Error(`No organization found for user ${user.id}`);
  }

  return organization;
});
