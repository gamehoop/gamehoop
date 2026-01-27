import { UIProvider } from '@/components/ui';
import { db } from '@/db';
import { Game, Player } from '@/db/types';
import { generateApiKey, hashApiKey, Scope } from '@/domain/game-api-key';
import { auth, Organization, User } from '@/libs/auth';
import { createPlayerAuth } from '@/libs/player-auth';
import { gameApiKeyRepo } from '@/repos/game-api-key-repo';
import { gameEventRepo } from '@/repos/game-event-repo';
import { gameRepo } from '@/repos/game-repo';
import { getRouter } from '@/router';
import { theme } from '@/styles/theme';
import { faker } from '@faker-js/faker';
import { ModalsProvider } from '@mantine/modals';
import { RouterContextProvider } from '@tanstack/react-router';
import { render as baseRender, RenderResult } from '@testing-library/react';
import { ReactElement } from 'react';
import { HttpMethod } from './http';

export function render(el: ReactElement): RenderResult {
  const router = getRouter();

  return baseRender(
    <RouterContextProvider router={router}>
      <UIProvider theme={theme} env="test">
        <ModalsProvider>{el}</ModalsProvider>
      </UIProvider>
    </RouterContextProvider>,
  );
}

export function apiRequest(
  options: RequestInit & {
    uri: string;
    data?: object;
    token?: string;
  },
): Request {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }
  return new Request(`http://localhost:3000/api/${options.uri}`, {
    method: HttpMethod.Post,
    headers,
    body: JSON.stringify(options.data ?? {}),
    ...options,
  });
}

export async function createTestUser(): Promise<{
  user: User;
  organization: Organization;
}> {
  const { user } = await auth.api.signUpEmail({
    body: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    },
  });

  const organization = await db
    .selectFrom('organization')
    .selectAll()
    .where('slug', '=', `user-org:${user.id}`)
    .executeTakeFirstOrThrow();

  return { user, organization };
}

export async function createGame({
  user,
  organization,
}: {
  user: User;
  organization: Organization;
}) {
  return gameRepo.create({
    name: faker.lorem.word(),
    organizationId: organization.id,
    createdBy: user.id,
    updatedBy: user.id,
  });
}

export async function createGameWithApiKey({
  user,
  organization,
  active = true,
  expired,
  scopes = [Scope.All],
}: {
  user: User;
  organization: Organization;
  active?: boolean;
  expired?: boolean;
  scopes?: Scope[];
}): Promise<{ game: Game; apiKey: string }> {
  const game = await createGame({ user, organization });
  const apiKey = generateApiKey();
  const keyHash = hashApiKey(apiKey);

  await gameApiKeyRepo.create({
    gameId: game.id,
    keyHash,
    active,
    scopes,
    description: faker.lorem.sentence(),
    expiresAt: expired ? faker.date.past() : undefined,
    createdBy: user.id,
  });

  return { game, apiKey };
}

export async function createPlayer({ game }: { game: Game }) {
  const { user: player } = await createPlayerAuth(game).signUpEmail({
    body: {
      gameId: game.id,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    },
  });
  return player as Player;
}

export async function createPlayers({
  game,
  n = 3,
}: {
  game: Game;
  n?: number;
}) {
  const players = [];
  for (let i = 0; i < n; i++) {
    players.push(await createPlayer({ game }));
  }
  return players;
}

export async function createGameEvents({
  game,
  player,
  n = 4,
}: {
  game: Game;
  player?: Player;
  n?: number;
}) {
  const events = [];
  for (let i = 0; i < n; i++) {
    const event = await gameEventRepo.create({
      gameId: game.id,
      playerId: player?.id,
      name: faker.lorem.word(),
      properties: {
        [faker.lorem.word()]: faker.number.int({ max: 100 }),
        [faker.lorem.word()]: faker.datatype.boolean(),
      },
      timestamp: faker.date.recent().toISOString(),
      sessionId: faker.string.uuid(),
      deviceId: faker.string.uuid(),
    });
    events.push(event);
  }
  return events;
}
