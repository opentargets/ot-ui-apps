import { defineConfig } from "vite";
import type { UserConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

/** Absolute path to the package root (apps/mcp-widgets-server). */
export const ROOT = resolve(__dirname, "..");

/** Monorepo root (two levels up from apps/mcp-widgets-server). */
const MONO_ROOT = resolve(ROOT, "../..");

const BASE_DEDUPE = [
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
  "@apollo/client",
  "graphql",
  "react-router-dom",
  "lodash",
];

export interface WidgetBuildOptions {
  /** Absolute path to the widget entry point (main.tsx). */
  entry: string;
  /** IIFE global variable name, e.g. "L2GWidget". */
  outputName: string;
  /** Output filename under dist/widgets/, e.g. "l2g.js". */
  outputFile: string;
  /**
   * Set to true for the first widget in the build chain so dist/widgets/ is
   * cleaned before the fresh build. All subsequent widgets use false to avoid
   * wiping previously built bundles.
   */
  emptyOutDir?: boolean;
  /** Widget-specific Vite plugins (stub plugins go here). */
  plugins: Plugin[];
  /** Extra entries added to the dedupe list, e.g. ["3dmol"]. */
  extraDedupe?: string[];
}

/**
 * Shared Vite plugin that stubs platform-specific paths which would otherwise
 * pull in heavy dependencies (graphiql CSS, OT-specific Apollo context).
 *
 * - DataDownloader.jsx → null component (prevents graphiql CSS from landing in bundle)
 * - OTApolloProvider.tsx → re-exports useApolloClient from standard @apollo/client
 *   so that useBatchQuery works under the standard ApolloProvider we provide in
 *   createWidgetEntry.tsx
 */
export function createPlatformStubsPlugin(): Plugin {
  const dataDownloaderPath = resolve(
    MONO_ROOT,
    "packages/ui/src/components/DataDownloader.jsx"
  );
  const otApolloProviderPath = resolve(
    MONO_ROOT,
    "packages/ui/src/providers/OTApolloProvider/OTApolloProvider.tsx"
  );
  // @ot/config's theme.ts calls lighten/darken (polished) on getConfig() colors at
  // module-load time. In the widget sandbox window.configProfile is absent so
  // primaryColor/secondaryColor are undefined → polished throws error #3.
  // Stub both files by absolute path (same pattern as OTApolloProvider/DataDownloader)
  // so polished is never invoked regardless of how the module is resolved.
  const otConfigThemePath = resolve(MONO_ROOT, "packages/ot-config/src/theme.ts");
  const otConfigEnvPath = resolve(MONO_ROOT, "packages/ot-config/src/environment.ts");

  return {
    name: "platform-stubs",
    load(id: string) {
      if (id === otConfigThemePath) {
        return `
import { createTheme } from "@mui/material";
const PRIMARY = "#3489ca";
const SECONDARY = "#ff6350";
export const theme = createTheme({
  palette: { primary: { main: PRIMARY }, secondary: { main: SECONDARY } },
});
`;
      }
      if (id === otConfigEnvPath) {
        const PRIMARY = "#3489ca";
        const SECONDARY = "#ff6350";
        return `
const PRIMARY = "${PRIMARY}";
const SECONDARY = "${SECONDARY}";
export function getConfig() {
  return {
    urlApi: "https://api.platform.opentargets.org/api/v4/graphql",
    urlAiApi: "",
    profile: { primaryColor: PRIMARY, secondaryColor: SECONDARY, isPartnerPreview: false, partnerDataTypes: [] },
    googleTagManagerID: null,
    geneticsPortalUrl: "https://genetics.opentargets.org",
    gitVersion: "",
  };
}
export function getEnvironmentConfig() { return getConfig(); }
`;
      }
      if (id === dataDownloaderPath) {
        return "export default function DataDownloader() { return null; }";
      }
      if (id === otApolloProviderPath) {
        // useBatchQuery calls useApolloClient() from this module.
        // Re-export from @apollo/client so standard ApolloProvider satisfies it.
        // OTApolloProvider itself is a no-op here (we provide ApolloProvider in createWidgetEntry).
        return `
export { useApolloClient } from "@apollo/client";
export function OTApolloProvider({ children }) { return children; }
`;
      }
    },
  };
}

/**
 * Transforms .gql/.graphql files into importable DocumentNode objects.
 * Replicates vite-plugin-simple-gql inline to avoid CJS/ESM interop issues.
 * The emitted code uses graphql-tag (re-exported by @apollo/client) so the
 * parsed document is cached and de-duplicated across imports.
 */
function gqlPlugin(): Plugin {
  return {
    name: "gql-transform",
    transform(src: string, id: string) {
      if (id.endsWith(".graphql") || id.endsWith(".gql")) {
        return {
          code: `import { gql } from "@apollo/client"; export default gql(${JSON.stringify(src)});`,
          map: null,
        };
      }
    },
  };
}

export function createWidgetBuildConfig(opts: WidgetBuildOptions): UserConfig {
  return defineConfig({
    plugins: [...opts.plugins, gqlPlugin(), react()],
    build: {
      lib: {
        entry: opts.entry,
        formats: ["iife"],
        name: opts.outputName,
      },
      outDir: resolve(ROOT, "dist/widgets"),
      emptyOutDir: opts.emptyOutDir ?? false,
      rollupOptions: {
        output: {
          entryFileNames: opts.outputFile,
          // Inline all assets and dynamic imports into the single IIFE file.
          inlineDynamicImports: true,
        },
      },
    },
    define: {
      // Replace Node.js global so the IIFE bundle works in the browser.
      "process.env.NODE_ENV": '"production"',
    },
    resolve: {
      // Deduplicate across the monorepo so each package has only one instance
      // in the bundle. Emotion packages must be deduplicated to ensure
      // CacheContext is shared between CacheProvider and @emotion/styled consumers.
      dedupe: [...BASE_DEDUPE, ...(opts.extraDedupe ?? [])],
      alias: {
        // Allow widget-src to import directly from monorepo packages.
        "@ot/ui": resolve(MONO_ROOT, "packages/ui/src"),
        "@ot/sections": resolve(MONO_ROOT, "packages/sections/src"),
        "@ot/constants": resolve(MONO_ROOT, "packages/ot-constants/src"),
        "@ot/utils": resolve(MONO_ROOT, "packages/ot-utils/src"),
      },
    },
  });
}
