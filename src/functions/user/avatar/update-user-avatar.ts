import { getUser } from '@/functions/auth/get-user';
import { updateUser } from '@/functions/user/update-user';
import { buildUserKey, getObjectUrl, putObject } from '@/libs/s3';
import { HttpMethod } from '@/utils/http';
import { createServerFn } from '@tanstack/react-start';

export const updateUserAvatar = createServerFn({ method: HttpMethod.Post })
  .inputValidator((formData) => {
    if (!(formData instanceof FormData)) {
      throw new TypeError('Invalid form data');
    }

    const avatar = formData.get('avatar') as File;
    if (!avatar) {
      throw new Error('avatar is required');
    }

    return avatar;
  })
  .handler(async ({ data: avatar }): Promise<void> => {
    const user = await getUser();

    const key = buildUserKey('avatar', user.id);
    const body = await avatar.arrayBuffer();
    const contentType = avatar.type;

    await putObject({
      key,
      body: body as unknown as Buffer,
      contentType,
    });

    const image = `${getObjectUrl(key)}?uploadedAt=${Date.now()}`;
    await updateUser({ data: { image } });
  });
