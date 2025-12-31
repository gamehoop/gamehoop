import { auth } from '@/lib/auth';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

export const getOrganizations = createServerFn().handler(async () => {
  return auth.api.listOrganizations({ headers: getRequestHeaders() });
});
