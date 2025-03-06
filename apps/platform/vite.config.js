import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import gql from "vite-plugin-simple-gql";
import svgrPlugin from "vite-plugin-svgr";
import viteCompression from "vite-plugin-compression";
import { execSync } from "child_process";

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
