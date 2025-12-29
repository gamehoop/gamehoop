import { Shell } from '@/components/app/shell/shell';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/_authed')({
  beforeLoad: ({ context: { user }, location }) => {
    if (!user) {
      throw redirect({ to: '/sign-in', search: { redirect: location.href } });
    }

    return { user };
  },
  loader: ({ context: { user } }) => {
    return { user };
  },
  component: Authed,
});

function Authed() {
  const { user } = Route.useLoaderData();

  return (
    <Shell user={user}>
      <Outlet />
    </Shell>
  );
}
