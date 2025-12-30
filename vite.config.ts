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
    rollupOptions: {
      output: {
        // Workaround for https://github.com/TanStack/router/discussions/4298
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.names?.[assetInfo.names.length - 1];
          if (fileName === 'app.css') {
            return `assets/styles/app.css`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
  },
  plugins: [
    devtools(),
    nitro(),
    viteTsConfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart({
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
