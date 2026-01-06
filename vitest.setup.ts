import { createServerFn } from '@tanstack/react-start';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// https://mantine.dev/guides/vitest
(function mantineMocks() {
  if (typeof window === 'undefined') {
    return;
  }

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
})();

type CreateServerFn = typeof createServerFn<'GET'>;
type ServerFnBuilder = ReturnType<CreateServerFn>;

(function mockTanstackStart() {
  if (typeof window === 'object') {
    return;
  }

  const mockServerFunctionBuider: ServerFnBuilder = vi.hoisted(() => {
    return {
      middleware: vi.fn(() => mockServerFunctionBuider),
      inputValidator: vi.fn(() => mockServerFunctionBuider),
      handler: vi.fn((func) => func),
    } as unknown as ServerFnBuilder;
  });

  const mockCreateServerFn: CreateServerFn = vi.hoisted(() => {
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
})();

(function mockEnv() {
  process.env.DATABASE_URL =
    'postgres://postgres:secret@localhost:5432/gamehoop';

  const mockCreateEnv = vi.hoisted(() => vi.fn(() => ({})));

  vi.mock('@t3-oss/env-core', () => ({
    createEnv: mockCreateEnv,
  }));
})();
