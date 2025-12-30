import { getUser } from '@/functions/auth/get-user';
import { updateUser } from '@/functions/user/update-user';
import { buildUserKey, deleteObject } from '@/lib/s3';
import { createServerFn } from '@tanstack/react-start';

export const deleteUserAvatar = createServerFn().handler(
  async (): Promise<void> => {
    const user = await getUser();
    const key = buildUserKey('avatar', user.id);
    await deleteObject(key);
    await updateUser({ data: { image: '' } });
  },
);
