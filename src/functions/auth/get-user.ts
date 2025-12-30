import { auth, SessionUser } from '@/lib/auth';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

export const getUser = createServerFn().handler(
  async (): Promise<SessionUser> => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });

    const user = session?.user;
    if (!user) {
      throw new Error('Unauthorized');
    }

    const organizations = await auth.api.listOrganizations({ headers });
    const organization = organizations[0];
    if (!organization) {
      throw new Error(`No organization found for user ${user.id}`);
    }

    return {
      ...user,
      organization,
    };
  },
);
