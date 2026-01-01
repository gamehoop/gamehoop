import { SessionContextProps } from '@/contexts/session-context';
import { getUser } from '@/functions/auth/get-user';
import { auth, Organization, User } from '@/lib/auth';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

export const getSessionContext = createServerFn().handler(
  async (): Promise<SessionContextProps> => {
    const [user, organizations] = await Promise.all([
      getUser(),
      auth.api.listOrganizations({ headers: getRequestHeaders() }),
    ]);

    const activeOrganization = getActiveOrganization(user, organizations);

    return {
      user,
      organizations,
      activeOrganization,
    };
  },
);

function getActiveOrganization(
  user: User,
  organizations: Organization[],
): Organization {
  const activeOrganization =
    organizations.find(
      (org) => org.id === user.settings?.activeOrganizationId,
    ) ?? organizations[0];

  if (!activeOrganization) {
    throw new Error(`No active organization found for user ${user.id}`);
  }

  return activeOrganization;
}
