import { env } from '@/env/client';
import { seo } from '@/utils/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/_authed/organization')({
  loader: async ({ context: { user } }) => {
    return { user };
  },
  head: ({ loaderData }) => ({
    meta: seo({
      title: `${loaderData?.user.organization.name || 'Organization'} | ${env.VITE_APP_NAME}`,
    }),
  }),
  component: Organization,
});

function Organization() {
  const { user } = Route.useLoaderData();

  return <div>{user.organization.name}</div>;
}
