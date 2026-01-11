import { getUser } from '@/functions/auth/get-user';
import { auth } from '@/lib/auth';
import { HttpMethod } from '@/utils/http';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import z from 'zod';

export const updateUser = createServerFn({ method: HttpMethod.Post })
  .inputValidator(
    z.object({
      email: z.email().optional(),
      name: z.string().optional(),
      image: z.string().optional(),
      activeOrganizationId: z.string().nullable().optional(),
      darkMode: z.boolean().optional(),
    }),
  )
  .handler(
    async ({
      data: { email, name, image, darkMode, activeOrganizationId },
    }): Promise<void> => {
      const user = await getUser();
      const headers = getRequestHeaders();

      if (
        (name !== undefined && name !== user.name) ||
        (image !== undefined && image !== user.image) ||
        (darkMode !== undefined && darkMode !== user.settings?.darkMode) ||
        (activeOrganizationId !== undefined &&
          activeOrganizationId !== user.settings?.activeOrganizationId)
      ) {
        await auth.api.updateUser({
          headers,
          body: {
            name: name ?? user.name,
            image: image ?? user.image,
            settings: {
              ...user.settings,
              activeOrganizationId:
                activeOrganizationId !== undefined
                  ? activeOrganizationId
                  : user.settings?.activeOrganizationId,
              darkMode: darkMode ?? user.settings?.darkMode,
            },
          },
        });
      }

      if (email !== undefined && email !== user.email) {
        await auth.api.changeEmail({
          headers,
          body: {
            newEmail: email,
            callbackURL: '/?verified=true',
          },
        });
      }
    },
  );
