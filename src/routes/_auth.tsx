import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth')({
  component: Auth,
});

function Auth() {
  return (
    <main className="w-full h-full flex items-center justify-center p-2">
      <Outlet />
    </main>
  );
}
