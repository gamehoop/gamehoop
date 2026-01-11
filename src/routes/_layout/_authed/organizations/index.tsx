import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/_authed/organizations/')({
  beforeLoad: async ({ context: { activeOrganization } }) => {
    if (!activeOrganization) {
      throw redirect({ to: '/' });
    }

    throw redirect({
      to: `/organizations/$organizationId`,
      params: { organizationId: activeOrganization.id },
    });
  },
});
