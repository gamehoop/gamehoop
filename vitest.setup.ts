import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// https://mantine.dev/guides/vitest
(function mantineMocks() {
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
