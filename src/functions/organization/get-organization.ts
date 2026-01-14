import { auth } from '@/libs/auth';
import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import z from 'zod';
import { getSessionContext } from '../auth/get-session-context';

export const getOrganization = createServerFn()
  .inputValidator(
    z.object({
      organizationId: z.string(),
    }),
  )
  .handler(async ({ data: { organizationId } }) => {
    const { user, organizations } = await getSessionContext();

    const isMember = organizations.some((org) => org.id === organizationId);
    if (!isMember) {
      throw notFound();
    }

    const organization = await auth.api.getFullOrganization({
      query: {
        organizationId,
      },
      headers: getRequestHeaders(),
    });

    if (!organization) {
      throw new Error(
        `No organization found with ID ${organizationId} for user ${user.id}`,
      );
    }

    return organization;
  });
