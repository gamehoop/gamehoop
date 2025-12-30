import { auth } from '@/lib/auth';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

export const getOrganization = createServerFn().handler(async () => {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });

  const user = session?.user;
  if (!user) {
    throw new Error('Unauthorized');
  }

  const organizations = await auth.api.listOrganizations({ headers });
  if (!organizations.length) {
    throw new Error(`No organization found for user ${user.id}`);
  }

  const organization = await auth.api.getFullOrganization({
    query: { organizationId: organizations[0]?.id },
    headers,
  });

  if (!organization) {
    throw new Error(`No organization found for user ${user.id}`);
  }

  return organization;
});
