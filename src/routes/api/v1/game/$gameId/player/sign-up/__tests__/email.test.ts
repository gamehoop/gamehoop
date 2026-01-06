import { db } from '@/db';
import { HttpStatus } from '@/utils/http';
import { apiRequest, initApiKey, initTestUser } from '@/utils/testing';
import { faker } from '@faker-js/faker';
import { sql } from 'kysely';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { POST } from '../email';

describe('email', () => {
  beforeAll(async () => await sql`BEGIN`.execute(db));
  afterAll(async () => await sql`ROLLBACK`.execute(db));

  it('should create a player and session', async () => {
    const { user, organization } = await initTestUser();
    const { game, apiKey } = await initApiKey({ user, organization });

    const playerDetails = {
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(),
    };

    const res = await POST({
      params: { gameId: game.publicId },
      request: apiRequest(`v1/game/${game.publicId}/player/sign-up/email`, {
        apiKey,
        body: playerDetails,
      }),
    });

    expect(res.status).toBe(HttpStatus.Created);

    const body = await res.json();
    expect(body.token).toEqual(expect.any(String));
    expect(body.player).toEqual({
      name: playerDetails.name,
      email: playerDetails.email,
      id: expect.any(String),
      emailVerified: false,
      gameId: game.id,
      image: null,
      isAnonymous: false,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('should require an API token', async () => {
    const res = await POST({
      params: { gameId: '1' },
      request: apiRequest('v1/game/1/player/sign-up/email'),
    });

    expect(res.status).toBe(HttpStatus.Unauthorized);
  });

  it('should require a valid API token', async () => {
    const res = await POST({
      params: { gameId: '1' },
      request: apiRequest('v1/game/1/player/sign-up/email', {
        apiKey: 'invalid',
      }),
    });

    expect(res.status).toBe(HttpStatus.Forbidden);
  });

  it('should require an active API token', async () => {
    const { user, organization } = await initTestUser();
    const { apiKey } = await initApiKey({
      user,
      organization,
      expired: true,
    });

    const res = await POST({
      params: { gameId: '1' },
      request: apiRequest('v1/game/1/player/sign-up/email', {
        apiKey,
      }),
    });

    expect(res.status).toBe(HttpStatus.Forbidden);
  });
});
