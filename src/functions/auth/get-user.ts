import { auth, User } from '@/lib/auth';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

export const getUser = createServerFn().handler(async (): Promise<User> => {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });

  const user = session?.user;
  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
});
