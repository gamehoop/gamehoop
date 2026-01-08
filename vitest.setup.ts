import { createServerFn } from '@tanstack/react-start';
import '@testing-library/jest-dom/vitest';
import { sql } from 'kysely';
import { afterAll, beforeAll, vi } from 'vitest';
import z from 'zod';

const isServer = typeof window === 'undefined';
if (isServer) {
  mockServerEnv();
  mockTanstackStart();
  testInDatabaseTransaction();
} else {
  mockMantine();
}

// Create a fake testing environment.
function mockServerEnv() {
  process.env.DATABASE_URL =
    'postgres://postgres:secret@localhost:5432/gamehoop';

  const mockCreateEnv = vi.hoisted(() =>
    vi.fn(() => ({
      DATABASE_URL: process.env.DATABASE_URL,
    })),
  );

  vi.mock('@t3-oss/env-core', () => ({
    createEnv: mockCreateEnv,
  }));
}

// There is no official/recommended way to test this library atm.
// This is a temporary workaround until a better solution is found.
function mockTanstackStart() {
  const mockCreateServerFn: typeof createServerFn<'GET'> = vi.hoisted(() => {
    return vi.fn(() => {
      let inputValidatorSchema: z.Schema | undefined;

      const builder = {
        middleware: vi.fn(function (this: unknown) {
          return this;
        }),
        inputValidator: vi.fn(function (this: unknown, schema?: z.Schema) {
          inputValidatorSchema = schema;
          return this;
        }),
        handler: vi.fn((func) => {
          return (input?: { data?: object }, ...args: unknown[]) => {
            if (inputValidatorSchema && input) {
              const { error } = inputValidatorSchema.safeParse(input?.data);
              if (error) {
                return Promise.reject(error);
              }
            }
            return func(input, ...args);
          };
        }),
      } as unknown as ReturnType<typeof createServerFn<'GET'>>;

      return builder;
    });
  });

  vi.mock('@tanstack/react-start', async (importOriginal) => {
    return {
      ...(await importOriginal()),
      createServerFn: mockCreateServerFn,
    };
  });

  const mockGetRequestHeaders = vi.hoisted(() => vi.fn(() => ({})));

  vi.mock('@tanstack/react-start/server', async (importOriginal) => {
    return {
      ...(await importOriginal()),
      getRequestHeaders: mockGetRequestHeaders,
    };
  });

  vi.mock('@tanstack/react-router', { spy: true });
}

// To avoid polluting our database and potential conflicts
function testInDatabaseTransaction() {
  beforeAll(async () => {
    const { db } = await import('@/db');
    await sql`BEGIN`.execute(db);
  });

  afterAll(async () => {
    const { db } = await import('@/db');
    await sql`ROLLBACK`.execute(db);
  });
}

// https://mantine.dev/guides/vitest
function mockMantine() {
  const getComputedStyle = window.getComputedStyle;
  window.getComputedStyle = (el) => getComputedStyle(el);

  window.HTMLElement.prototype.scrollIntoView = () => {};

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  window.ResizeObserver = ResizeObserver;
}
