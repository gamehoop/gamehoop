import { auth, SessionUser } from '@/lib/auth';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

export const getUser = createServerFn().handler(
  async (): Promise<SessionUser> => {
    const session = await auth.api.getSession({
      headers: getRequestHeaders(),
    });

    const user = session?.user;
    if (!user) {
      throw new Error('Unauthorized');
    }

    return user;
  },
);
