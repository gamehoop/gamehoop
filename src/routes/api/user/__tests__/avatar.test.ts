import { auth, Session } from '@/libs/auth';
import { getUserObject } from '@/libs/s3';
import { HttpStatus } from '@/utils/http';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '../avatar';

vi.mock('@/libs/s3', { spy: true });

describe('GET /api/user/avatar', () => {
  const mockUser = { id: faker.string.uuid() };

  beforeEach(() => {
    vi.spyOn(auth.api, 'getSession').mockResolvedValue({
      session: {},
      user: mockUser,
    } as Session);
  });

  it('should return the logo when it exists', async () => {
    const mockLogoData = new Uint8Array([137, 80, 78, 71]);

    vi.mocked(getUserObject).mockResolvedValue({
      transformToByteArray: vi.fn().mockResolvedValue(mockLogoData),
    } as any);

    const res = await GET();

    expect(res.status).toStrictEqual(HttpStatus.Ok);

    const arrayBuffer = await res.arrayBuffer();
    const responseData = new Uint8Array(arrayBuffer);
    expect(responseData).toStrictEqual(mockLogoData);

    expect(getUserObject).toHaveBeenCalledWith({
      key: 'avatar',
      userId: mockUser.id,
    });
  });

  it('should return 404 when the logo does not exist', async () => {
    vi.mocked(getUserObject).mockResolvedValue(undefined);

    const res = await GET();

    expect(res.status).toStrictEqual(HttpStatus.NotFound);
  });
});
