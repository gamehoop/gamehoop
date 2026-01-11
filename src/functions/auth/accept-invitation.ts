import { auth } from '@/lib/auth';
import { HttpMethod } from '@/utils/http';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import z from 'zod';

export const acceptInvitation = createServerFn({ method: HttpMethod.Post })
  .inputValidator(
    z.object({
      invitationId: z.string().min(1),
    }),
  )
  .handler(async ({ data: { invitationId } }): Promise<void> => {
    await auth.api.acceptInvitation({
      body: { invitationId },
      headers: getRequestHeaders(),
    });
  });
