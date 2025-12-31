import { auth } from '@/lib/auth';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { getOrganization } from './get-organization';

export const getOrganizationInvitations = createServerFn().handler(async () => {
  const headers = getRequestHeaders();

  const organization = await getOrganization();

  const invitations = await auth.api.listInvitations({
    query: { organizationId: organization.id },
    headers,
  });

  return invitations;
});
