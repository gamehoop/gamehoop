import { QueryClient } from '@tanstack/react-query';

export function getContext(): { queryClient: QueryClient } {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Consider cached query data to be fresh for 1 minute.
        staleTime: 1000 * 60 * 1,
        // Disable automatic retries.
        retry: 0,
        // The query will refetch on window focus if the data is stale.
        refetchOnWindowFocus: true,
        // The query will refetch on reconnect if the data is stale.
        refetchOnReconnect: true,
        // The query will refetch on mount if the data is stale.
        refetchOnMount: true,
      },
    },
  });

  return { queryClient };
}
