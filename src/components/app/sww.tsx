import { logger } from '@/lib/logger';
import { Button, Title } from '@mantine/core';
import { useRouter } from '@tanstack/react-router';
import { RefreshCw } from 'lucide-react';

export function SomethingWentWrong({ error }: { error: Error }) {
  const router = useRouter();

  logger.error(error.message);

  return (
    <div className="p-2 flex flex-col items-center gap-4">
      <Title order={2}>Sorry! Something went wrong.</Title>

      <p>Please try refreshing the page or contact support.</p>

      <Button onClick={() => router.invalidate()} leftSection={<RefreshCw />}>
        Refresh
      </Button>
    </div>
  );
}
