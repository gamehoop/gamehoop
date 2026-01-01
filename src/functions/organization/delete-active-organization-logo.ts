import { auth } from '@/lib/auth';
import { buildKey, deleteObject } from '@/lib/s3';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { getSessionContext } from '../auth/get-session-context';

export const deleteActiveOrganizationLogo = createServerFn().handler(
  async (): Promise<void> => {
    const { user, activeOrganization } = await getSessionContext();
    if (user.role === 'member') {
      throw new Error('Unauthorized');
    }

    const key = buildKey(`organizations/${activeOrganization.id}/logo`);
    await deleteObject(key);
    await auth.api.updateOrganization({
      body: {
        organizationId: activeOrganization.id,
        data: {
          logo: '',
        },
      },
      headers: getRequestHeaders(),
    });
  },
);
