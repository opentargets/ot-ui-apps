import { defineConfig } from 'vite';
// import svgrPlugin from 'vite-plugin-svgr';
import react from "@vitejs/plugin-react";
import gql from 'vite-plugin-simple-gql';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: './bundle-genetics',
  },
  plugins: [
    // svgrPlugin({
    //   svgrOptions: {
    //     icon: true,
    //     // ...svgr options (https://react-svgr.com/docs/options/)
    //   },
    // }),
    react(),
    gql(),
  ],
});
