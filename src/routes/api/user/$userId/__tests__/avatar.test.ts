import { auth, Session } from '@/lib/auth';
import { getUserObject } from '@/lib/s3';

import { getActiveOrganization } from '@/functions/organization/get-active-organization';
import { HttpStatus } from '@/utils/http';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '../avatar';

vi.mock('@/lib/s3', { spy: true });
vi.mock('@/functions/organization/get-active-organization');

describe('GET /api/user/$userId/avatar', () => {
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

    const userId = faker.string.uuid();

    vi.mocked(getActiveOrganization).mockResolvedValue({
      members: [{ userId }],
    } as any);

    const res = await GET({ params: { userId } });

    expect(res.status).toEqual(HttpStatus.Ok);

    const arrayBuffer = await res.arrayBuffer();
    const responseData = new Uint8Array(arrayBuffer);
    expect(responseData).toEqual(mockLogoData);

    expect(getUserObject).toHaveBeenCalledWith({
      key: 'avatar',
      userId,
    });
  });

  it('should return 404 when the logo does not exist', async () => {
    const userId = faker.string.uuid();

    vi.mocked(getActiveOrganization).mockResolvedValue({
      members: [{ userId }],
    } as any);

    vi.mocked(getUserObject).mockResolvedValue(undefined);

    const res = await GET({ params: { userId } });

    expect(res.status).toEqual(HttpStatus.NotFound);
  });
});
