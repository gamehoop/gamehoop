import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react-swc';
import crypto from 'crypto';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';

const config = defineConfig({
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 2000, // >= 2MB
  },
  plugins: [
    devtools(),
    nitro(),
    viteTsConfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart({
      router: { routeFileIgnorePattern: '.test.ts' },
      serverFns: {
        generateFunctionId: ({ filename, functionName }) => {
          const hash = crypto.createHash('sha1').update(filename).digest('hex');
          return `${functionName}-${hash}`;
        },
      },
    }),
    react(),
  ],
});

export default config;
