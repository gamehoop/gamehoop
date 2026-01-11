import { OrganizationDetails } from '@/components/app/organization/organization-details';
import { env } from '@/env/client';
import { getOrganization } from '@/functions/organization/get-organization';
import { seo } from '@/utils/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_layout/_authed/organizations/$organizationId',
)({
  loader: async ({ params: { organizationId } }) => {
    const organization = await getOrganization({
      data: { organizationId },
    });
    return { organization };
  },
  head: ({ loaderData }) => ({
    meta: seo({
      title: `${loaderData?.organization.name || 'Organization'} | ${env.VITE_APP_NAME}`,
    }),
  }),
  component: Organization,
});

function Organization() {
  const { organization } = Route.useLoaderData();
  return <OrganizationDetails organization={organization} />;
}
