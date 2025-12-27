import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import tsConfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// https://vitest.dev/config
export default defineConfig({
  plugins: [
    // Adds support for TypeScript path aliases
    tsConfigPaths(),
    // To use React
    react(),
    // To use Tailwind CSS
    tailwindcss(),
  ],
  test: {
    // Run tests in an emulated browser environment
    environment: 'jsdom',
    // Run the code in this file before the tests
    setupFiles: 'vitest.setup.ts',
    // Run these test files
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    // Call .mockClear() on all spies before each test
    clearMocks: true,
    // Call .mockReset() on all spies before each test
    mockReset: true,
  },
});
