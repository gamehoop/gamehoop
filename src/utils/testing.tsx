import { UIProvider } from '@/components/ui';
import { generateApiKey, hashApiKey } from '@/domain/game-api-key';
import { auth, Organization, User } from '@/lib/auth';
import { getRouter } from '@/router';
import { gameApiKeyStore } from '@/stores/game-api-key-store';
import { gameStore } from '@/stores/game-store';
import { theme } from '@/styles/theme';
import { faker } from '@faker-js/faker';
import { ModalsProvider } from '@mantine/modals';
import { RouterContextProvider } from '@tanstack/react-router';
import { render as baseRender } from '@testing-library/react';
import { ReactElement } from 'react';
import { HttpMethod } from './http';

export function render(el: ReactElement) {
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
  uri: string,
  options?: Omit<RequestInit, 'body'> & {
    body?: object | null;
    apiKey?: string;
  },
): Request {
  return new Request(`http://localhost:3000/api/${uri}`, {
    method: HttpMethod.Post,
    headers: {
      Authorization: options?.apiKey ? `Bearer ${options.apiKey}` : '',
    },
    ...options,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });
}

export async function initTestUser() {
  const { user } = await auth.api.signUpEmail({
    body: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    },
  });

  const organization = await auth.api.createOrganization({
    body: {
      name: faker.company.name(),
      slug: `org-${user.id}`,
      userId: user.id,
    },
  });

  if (!organization) {
    throw new Error(`Failed to create test user organization`);
  }

  return { user, organization };
}

export async function initApiKey({
  user,
  organization,
  expired,
}: {
  user: User;
  organization: Organization;
  expired?: boolean;
}) {
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
    scopes: ['*'],
    description: faker.lorem.sentence(),
    expiresAt: expired ? faker.date.past() : undefined,
    createdBy: user.id,
  });

  return { game, apiKey };
}
