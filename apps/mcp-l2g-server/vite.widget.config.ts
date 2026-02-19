import { defineConfig } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

/**
 * Vite plugin that intercepts the `packages/ui` barrel index when it is
 * actually loaded (after path resolution), replacing it with lightweight stubs.
 *
 * Using the `load` hook (which receives fully-resolved absolute module IDs)
 * is more reliable than `resolveId` for catching relative barrel imports
 * like `"../../index"` from within packages/ui components.
 *
 * Also stubs `.gql` files so that any ui component that lazily imports a
 * GraphQL document (e.g. L2GScoreIndicator) doesn't break the IIFE build.
 */
function stubUiBarrel(): Plugin {
  const uiIndexPath = resolve(__dirname, "../../packages/ui/src/index.tsx");
  const stubPath = resolve(__dirname, "widget-src/stubs/ui-index.tsx");

  return {
    name: "stub-ui-barrel",
    load(id: string) {
      // Intercept the ui barrel (reached via "../../index", "ui" package name, etc.)
      if (id === uiIndexPath) {
        return `export { Link, DataDownloader, ObsPlot, ObsChart, Tooltip, OtAsyncTooltip } from ${JSON.stringify(stubPath)};`;
      }

      // Stub .gql files — prevents GraphQL document imports from crashing the build
      // (e.g. L2GScoreIndicator imports Locus2GeneQuery.gql via @apollo/client)
      if (id.endsWith(".gql")) {
        return "const doc = { definitions: [], loc: { source: { body: '' } } }; export default doc;";
      }
    },
  };
}

/**
 * Builds the L2G widget as a self-contained IIFE bundle served by the MCP server.
 * The widget uses @modelcontextprotocol/ext-apps App class to connect via AppBridge.
 */
export default defineConfig({
  plugins: [stubUiBarrel(), react()],
  build: {
    lib: {
      entry: resolve(__dirname, "widget-src/main.tsx"),
      formats: ["iife"],
      name: "L2GWidget",
    },
    outDir: "dist/widgets",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: "l2g.js",
        // Inline all assets into the single JS file
        inlineDynamicImports: true,
      },
    },
  },
  define: {
    // Replace Node.js global so the IIFE bundle works in the browser
    "process.env.NODE_ENV": '"production"',
  },
  resolve: {
    // Deduplicate across the monorepo so there's only one copy of each in the bundle.
    // Emotion packages must be deduplicated to ensure CacheContext is a single object
    // shared between CacheProvider and all @emotion/styled consumers (otherwise the
    // context write and read go to different React contexts → styles never apply).
    dedupe: [
      "react",
      "react-dom",
      "@emotion/react",
      "@emotion/styled",
      "@emotion/cache",
      "@emotion/sheet",
      "@emotion/utils",
      "@emotion/serialize",
      "@mui/material",
      "@mui/system",
    ],
    alias: {
      // Allow widget-src to import directly from monorepo packages
      "@ot/ui": resolve(__dirname, "../../packages/ui/src"),
    },
  },
});
