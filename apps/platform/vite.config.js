import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import gql from 'vite-plugin-simple-gql';
import svgrPlugin from 'vite-plugin-svgr';

export default defineConfig({
  build: {
    outDir: './bundle-platform',
  },
  plugins: [
    react(),
    gql(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
});
