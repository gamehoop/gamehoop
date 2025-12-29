import { db } from '@/db';
import { auth, SessionUser } from '@/lib/auth';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

export const getUser = createServerFn().handler(
  async (): Promise<SessionUser> => {
    const session = await auth.api.getSession({
      headers: getRequestHeaders(),
    });

    const user = session?.user;
    if (!user) {
      throw new Error('Unauthorized');
    }

    const activeOrganizationId = session.session?.activeOrganizationId;
    if (!activeOrganizationId) {
      throw new Error('No active organization');
    }

    const organization = await db
      .selectFrom('organization')
      .where('id', '=', activeOrganizationId)
      .selectAll()
      .executeTakeFirstOrThrow();

    return {
      ...user,
      organization,
    };
  },
);
