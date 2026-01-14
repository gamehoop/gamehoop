import { getUser } from '@/functions/auth/get-user';
import { updateUser } from '@/functions/user/update-user';
import { buildUserKey, deleteObject } from '@/libs/s3';
import { HttpMethod } from '@/utils/http';
import { createServerFn } from '@tanstack/react-start';

export const deleteUserAvatar = createServerFn({
  method: HttpMethod.Post,
}).handler(async (): Promise<void> => {
  const user = await getUser();
  const key = buildUserKey('avatar', user.id);
  await deleteObject(key);
  await updateUser({ data: { image: '' } });
});
