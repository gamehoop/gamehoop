import { auth } from '@/libs/auth';
import { buildKey, deleteObject } from '@/libs/s3';
import { HttpMethod } from '@/utils/http';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import z from 'zod';
import { getSessionContext } from '../../auth/get-session-context';

export const deleteOrganizationLogo = createServerFn({
  method: HttpMethod.Post,
})
  .inputValidator(
    z.object({
      organizationId: z.string(),
    }),
  )
  .handler(async ({ data: { organizationId } }): Promise<void> => {
    const { user, organizations } = await getSessionContext();
    const isMember = organizations.some((org) => org.id === organizationId);
    if (!isMember || user.role === 'member') {
      throw new Error('Forbidden');
    }

    const key = buildKey(`organizations/${organizationId}/logo`);
    await deleteObject(key);
    await auth.api.updateOrganization({
      body: {
        organizationId,
        data: {
          logo: '',
        },
      },
      headers: getRequestHeaders(),
    });
  });
