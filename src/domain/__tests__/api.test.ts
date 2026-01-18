import { HttpStatus } from '@/utils/http';
import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { getBearerToken, verifyApiToken } from '../api';

describe('verifyApiToken', () => {
  it('should throw unauthorized if no api token is provided', async () => {
    const request = new Request(faker.internet.url());
    await expect(
      verifyApiToken({ request, gameId: faker.string.uuid() }),
    ).rejects.toThrow(
      expect.objectContaining({ status: HttpStatus.Unauthorized }),
    );
  });
});

describe('getBearerToken', () => {
  it('should parse and return a bearer token', () => {
    const token = faker.string.uuid();
    const request = new Request(faker.internet.url(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = getBearerToken(request);
    expect(result).toStrictEqual(token);
  });

  it('should return null if no Authorization header is present', () => {
    const request = new Request(faker.internet.url(), {
      headers: {},
    });

    const result = getBearerToken(request);
    expect(result).toBeNull();
  });

  it('should return null if Authorization header is not in the correct format', () => {
    const request = new Request(faker.internet.url(), {
      headers: {
        Authorization: faker.string.uuid(),
      },
    });

    const result = getBearerToken(request);
    expect(result).toBeNull();
  });
});
