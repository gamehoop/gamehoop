import { auth } from '@/lib/auth';
import { buildKey, getObjectUrl, putObject } from '@/lib/s3';
import { HttpMethod } from '@/utils/http';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { getSessionContext } from '../auth/get-session-context';

export const updateActiveOrganizationLogo = createServerFn({
  method: HttpMethod.Post,
})
  .inputValidator((formData) => {
    if (!(formData instanceof FormData)) {
      throw new TypeError('Invalid form data');
    }

    const logo = formData.get('logo') as File;
    if (!logo) {
      throw new Error('logo is required');
    }

    return { logo };
  })
  .handler(async ({ data: { logo } }): Promise<void> => {
    const { user, activeOrganization } = await getSessionContext();
    if (user.role === 'member') {
      throw new Error('Unauthorized');
    }

    const key = buildKey(`organizations/${activeOrganization.id}/logo`);
    const body = await logo.arrayBuffer();
    const contentType = logo.type;

    await putObject({
      key,
      body: body as unknown as Buffer,
      contentType,
    });

    const image = `${getObjectUrl(key)}?uploadedAt=${Date.now()}`;
    await auth.api.updateOrganization({
      body: {
        data: {
          logo: image,
        },
      },
      headers: getRequestHeaders(),
    });
  });
