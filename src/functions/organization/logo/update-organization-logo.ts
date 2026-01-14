import { auth } from '@/libs/auth';
import { buildKey, getObjectUrl, putObject } from '@/libs/s3';
import { HttpMethod } from '@/utils/http';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { getSessionContext } from '../../auth/get-session-context';

export const updateOrganizationLogo = createServerFn({
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

    const organizationId = formData.get('organizationId') as string;
    if (!organizationId) {
      throw new Error('organizationId is required');
    }

    return { logo, organizationId };
  })
  .handler(async ({ data: { logo, organizationId } }): Promise<void> => {
    const { user, organizations } = await getSessionContext();
    const isMember = organizations.some((org) => org.id === organizationId);
    if (!isMember || user.role === 'member') {
      throw new Error('Forbidden');
    }

    const key = buildKey(`organizations/${organizationId}/logo`);
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
        organizationId,
        data: {
          logo: image,
        },
      },
      headers: getRequestHeaders(),
    });
  });
