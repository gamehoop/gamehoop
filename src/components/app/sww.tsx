import { Button } from '@/components/ui/button';
import { Title } from '@/components/ui/title';
import { logError } from '@/libs/logger';
import { ErrorComponentProps, useRouter } from '@tanstack/react-router';
import { RefreshCw } from 'lucide-react';

export function SomethingWentWrong({ error }: ErrorComponentProps) {
  const router = useRouter();

  logError(error);

  return (
    <div className="p-2 flex flex-col items-center gap- w-full h-full justify-center">
      <Title order={2}>Sorry! Something went wrong.</Title>

      <p className="mb-4">Please try refreshing the page or contact support.</p>

      <Button onClick={() => router.invalidate()} leftSection={<RefreshCw />}>
        Refresh
      </Button>
    </div>
  );
}
