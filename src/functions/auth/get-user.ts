import { auth, User } from '@/libs/auth';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

export const getUser = createServerFn().handler(async (): Promise<User> => {
  const session = await auth.api.getSession({ headers: getRequestHeaders() });
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  return session.user;
});
