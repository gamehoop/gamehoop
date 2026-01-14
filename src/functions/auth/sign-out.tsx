import { auth } from '@/libs/auth';
import { HttpMethod } from '@/utils/http';
import { redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

export const signOut = createServerFn({ method: HttpMethod.Post }).handler(
  async (): Promise<void> => {
    await auth.api.signOut({ headers: getRequestHeaders() });
    throw redirect({ to: '/sign-in' });
  },
);
