import { SessionContextProps } from '@/contexts/session-context';
import { getSessionContext } from '@/functions/auth/get-session-context';
import { buildKey, getObject } from '@/libs/s3';
import { HttpStatus } from '@/utils/http';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '../logo';

vi.mock('@/libs/s3', { spy: true });
vi.mock('@/functions/auth/get-session-context');

describe('GET /api/organizations/$organizationId/logo', () => {
  beforeEach(() => {
    vi.mocked(getSessionContext).mockResolvedValue({
      organizations: [{ id: faker.string.uuid() }],
    } as SessionContextProps);
  });

  it('should return the logo when it exists', async () => {
    const mockLogoData = new Uint8Array([137, 80, 78, 71]);

    vi.mocked(getObject).mockResolvedValue({
      transformToByteArray: vi.fn().mockResolvedValue(mockLogoData),
    } as any);

    const organizationId = faker.string.uuid();

    vi.mocked(getSessionContext).mockResolvedValue({
      organizations: [{ id: organizationId }],
    } as SessionContextProps);

    const res = await GET({
      params: { organizationId },
    });

    expect(res.status).toEqual(HttpStatus.Ok);

    const arrayBuffer = await res.arrayBuffer();
    const responseData = new Uint8Array(arrayBuffer);
    expect(responseData).toEqual(mockLogoData);

    expect(getObject).toHaveBeenCalledWith(
      buildKey(`organizations/${organizationId}/logo`),
    );
  });

  it('should return 404 when the current user is not a member of the org', async () => {
    const organizationId = faker.string.uuid();

    vi.mocked(getSessionContext).mockResolvedValue({
      organizations: [{ id: faker.string.uuid() }],
    } as SessionContextProps);

    const res = await GET({
      params: { organizationId },
    });

    expect(res.status).toEqual(HttpStatus.NotFound);
  });

  it('should return 404 when the logo does not exist', async () => {
    vi.mocked(getObject).mockResolvedValue(undefined);

    const res = await GET({
      params: { organizationId: faker.string.uuid() },
    });

    expect(res.status).toEqual(HttpStatus.NotFound);
  });
});
