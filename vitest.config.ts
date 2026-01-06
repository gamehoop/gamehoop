import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import tsConfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// https://vitest.dev/config
export default defineConfig({
  plugins: [tsConfigPaths(), react(), tailwindcss()],
  test: {
    // Run tests in a server environment
    environment: 'node',
    // Run the code in this file before each test file
    setupFiles: 'vitest.setup.ts',
    // Run these test files
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    // Call .mockClear() on all spies before each test
    clearMocks: true,
    // Call .mockReset() on all spies before each test
    mockReset: true,
  },
});
