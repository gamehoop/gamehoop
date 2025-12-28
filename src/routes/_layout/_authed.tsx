import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/_authed')({
  beforeLoad: ({ context: { user }, location }) => {
    if (!user) {
      throw redirect({ to: '/sign-in', search: { redirect: location.href } });
    }

    return { user };
  },
  component: Authed,
});

function Authed() {
  return <Outlet />;
}
