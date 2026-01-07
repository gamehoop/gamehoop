import { createServerFn } from '@tanstack/react-start';
import '@testing-library/jest-dom/vitest';
import { sql } from 'kysely';
import { afterAll, beforeAll, vi } from 'vitest';

const isServer = typeof window === 'undefined';
if (isServer) {
  mockServerEnv();
  mockTanstackStart();
  testInDatabaseTransaction();
} else {
  mockMantine();
}

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

function mockTanstackStart() {
  const mockServerFunctionBuider: ReturnType<typeof createServerFn<'GET'>> =
    vi.hoisted(() => {
      return {
        middleware: vi.fn(() => mockServerFunctionBuider),
        inputValidator: vi.fn(() => mockServerFunctionBuider),
        handler: vi.fn((func) => func),
      } as unknown as ReturnType<typeof createServerFn<'GET'>>;
    });

  const mockCreateServerFn: typeof createServerFn<'GET'> = vi.hoisted(() => {
    return vi.fn(() => mockServerFunctionBuider);
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
