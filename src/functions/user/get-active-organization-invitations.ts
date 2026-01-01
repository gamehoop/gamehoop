import { auth } from '@/lib/auth';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { getSessionContext } from '../auth/get-session-context';

export const getActiveOrganizationInvitations = createServerFn().handler(
  async () => {
    const { activeOrganization } = await getSessionContext();

    const invitations = await auth.api.listInvitations({
      query: { organizationId: activeOrganization.id },
      headers: getRequestHeaders(),
    });

    return invitations;
  },
);
