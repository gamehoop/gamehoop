import { UIProvider } from '@/components/ui';
import { db } from '@/db';
import { Game } from '@/db/types';
import { generateApiKey, hashApiKey, Scope } from '@/domain/game-api-key';
import { auth, Organization, User } from '@/lib/auth';
import { getRouter } from '@/router';
import { gameApiKeyStore } from '@/stores/game-api-key-store';
import { gameStore } from '@/stores/game-store';
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
    apiKey?: string;
    sessionToken?: string;
  },
): Request {
  return new Request(`http://localhost:3000/api/${options.uri}`, {
    method: HttpMethod.Post,
    headers: {
      Authorization: options?.apiKey ? `Bearer ${options.apiKey}` : '',
      'Content-Type': 'application/json',
      'X-Session-Token': options?.sessionToken ?? '',
    },
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

export async function createGameWithApiKey({
  user,
  organization,
  expired,
}: {
  user: User;
  organization: Organization;
  expired?: boolean;
}): Promise<{ game: Game; apiKey: string }> {
  const game = await gameStore.create({
    name: faker.lorem.word(),
    organizationId: organization.id,
    createdBy: user.id,
    updatedBy: user.id,
  });

  const apiKey = generateApiKey();
  const keyHash = hashApiKey(apiKey);

  await gameApiKeyStore.create({
    gameId: game.id,
    keyHash,
    scopes: [Scope.All],
    description: faker.lorem.sentence(),
    expiresAt: expired ? faker.date.past() : undefined,
    createdBy: user.id,
  });

  return { game, apiKey };
}
