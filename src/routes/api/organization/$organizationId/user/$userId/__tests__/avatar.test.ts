import { auth, Organization, Session } from '@/lib/auth';
import { getUserObject } from '@/lib/s3';

import { HttpStatus } from '@/utils/http';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '../avatar';

vi.mock('@/lib/s3', { spy: true });

describe('GET /api/organization/$organizationId/user/$userId/avatar', () => {
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

    const mockOrganizationId = faker.string.uuid();
    const mockOrganizations = [
      { id: mockOrganizationId },
      { id: faker.string.uuid() },
    ] as Organization[];
    vi.spyOn(auth.api, 'listOrganizations').mockResolvedValue(
      mockOrganizations,
    );

    const res = await GET({
      params: { userId, organizationId: mockOrganizationId },
    });

    expect(res.status).toEqual(HttpStatus.Ok);

    const arrayBuffer = await res.arrayBuffer();
    const responseData = new Uint8Array(arrayBuffer);
    expect(responseData).toEqual(mockLogoData);

    expect(getUserObject).toHaveBeenCalledWith({
      key: 'avatar',
      userId,
    });
  });

  it('should return 404 for organizations the user is not a member of', async () => {
    const userId = faker.string.uuid();

    vi.spyOn(auth.api, 'listOrganizations').mockResolvedValue([
      { id: faker.string.uuid() },
      { id: faker.string.uuid() },
    ] as Organization[]);

    vi.mocked(getUserObject).mockResolvedValue(undefined);

    const res = await GET({
      params: { userId, organizationId: faker.string.uuid() },
    });

    expect(res.status).toEqual(HttpStatus.NotFound);
  });

  it('should return 404 when the logo does not exist', async () => {
    const userId = faker.string.uuid();

    vi.spyOn(auth.api, 'listOrganizations').mockResolvedValue([
      { id: faker.string.uuid() },
      { id: faker.string.uuid() },
    ] as Organization[]);

    vi.mocked(getUserObject).mockResolvedValue(undefined);

    const res = await GET({ params: { userId, organizationId: '' } });

    expect(res.status).toEqual(HttpStatus.NotFound);
  });
});
