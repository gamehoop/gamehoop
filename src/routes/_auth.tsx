import { useColorScheme } from '@/components/ui/hooks/use-color-scheme';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/_auth')({
  component: Auth,
});

function Auth() {
  const { setColorScheme } = useColorScheme();

  useEffect(() => setColorScheme('light'), [setColorScheme]);

  return (
    <main className="w-full h-full flex items-center justify-center p-2">
      <Outlet />
    </main>
  );
}
