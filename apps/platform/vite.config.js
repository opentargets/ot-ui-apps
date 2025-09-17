import { execSync } from "node:child_process";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
import gql from "vite-plugin-simple-gql";
import svgrPlugin from "vite-plugin-svgr";

const getGitVersion = () => {
  try {
    return execSync("git describe --tags --always").toString().trim();
  } catch (error) {
    return "unknown";
  }
};

export default defineConfig({
  build: {
    outDir: "./bundle-platform",
  },
  define: {
    "import.meta.env.VITE_GIT_VERSION": JSON.stringify(getGitVersion()),
  },
  plugins: [
    react(),
    gql(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      },
    }),
    viteCompression(),
  ],
});
