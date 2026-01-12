import { SessionContextProps } from '@/contexts/session-context';
import { getSessionContext } from '@/functions/auth/get-session-context';
import { buildKey, getObject } from '@/lib/s3';
import { HttpStatus } from '@/utils/http';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '../logo';

vi.mock('@/lib/s3', { spy: true });
vi.mock('@/functions/auth/get-session-context');

describe('GET /api/games/$gameId/logo', () => {
  const activeOrganization = { id: faker.string.uuid() };

  beforeEach(() => {
    vi.mocked(getSessionContext).mockResolvedValue({
      activeOrganization,
    } as SessionContextProps);
  });

  it('should return the logo when it exists', async () => {
    const mockLogoData = new Uint8Array([137, 80, 78, 71]);

    vi.mocked(getObject).mockResolvedValue({
      transformToByteArray: vi.fn().mockResolvedValue(mockLogoData),
    } as any);

    const gameId = faker.string.uuid();

    const res = await GET({
      params: { gameId },
    });

    expect(res.status).toEqual(HttpStatus.Ok);

    const arrayBuffer = await res.arrayBuffer();
    const responseData = new Uint8Array(arrayBuffer);
    expect(responseData).toEqual(mockLogoData);

    expect(getObject).toHaveBeenCalledWith(
      buildKey(`organizations/${activeOrganization.id}/game/${gameId}/logo`),
    );
  });

  it('should return 404 when the logo does not exist', async () => {
    vi.mocked(getObject).mockResolvedValue(undefined);

    const res = await GET({
      params: { gameId: faker.string.uuid() },
    });

    expect(res.status).toEqual(HttpStatus.NotFound);
  });
});
