import { defineConfig } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

/**
 * Stub plugin for the molecular-structure widget.
 *
 * The ui barrel is replaced with a thin shim that:
 *   - Stubs unused components (DataDownloader, ObsPlot, ViewerTrack, etc.)
 *   - Re-exports the real ViewerInteraction hooks so Viewer.tsx shares
 *     the same React context as the widget's ViewerInteractionProvider.
 *
 * ViewerProvider / useViewerState / useViewerDispatch are imported directly
 * from their source file in MolecularStructureWidget.tsx (not via barrel),
 * so they don't need to appear here.
 */
// Minimal @ot/config stub with hardcoded colours so theme.ts doesn't crash.
const OT_CONFIG_STUB = `
export function getConfig() {
  return {
    urlApi: "https://api.platform.opentargets.org/api/v4/graphql",
    urlAiApi: "",
    gitVersion: "",
    profile: {
      primaryColor: "#3489ca",
      secondaryColor: "#ff6350",
      isPartnerPreview: false,
      partnerPreviewDatasets: [],
      partnerDataTypes: [],
    },
    googleTagManagerID: null,
    geneticsPortalUrl: "https://genetics.opentargets.org",
  };
}
export const theme = {};
export const getEnvironmentConfig = () => ({});
`;

function stubUiBarrelForMs(): Plugin {
  const uiIndexPath = resolve(__dirname, "../../packages/ui/src/index.tsx");
  const stubPath = resolve(__dirname, "widget-src/stubs/ui-ms-index.tsx");

  // Paths that should serve the stub instead of the real barrel.
  // The "ui" package is a symlink in node_modules — Vite may pass either the
  // symlinked path or the real path to resolveId/load, so we intercept both.
  const nodeModulesUiIndex = resolve(
    __dirname,
    "../../node_modules/ui/src/index.tsx"
  );

  // @ot/config resolved paths (barrel + individual files)
  const otConfigDir = resolve(__dirname, "../../packages/ot-config/src");

  function isBarrel(id: string) {
    return id === uiIndexPath || id === nodeModulesUiIndex;
  }

  function isOtConfig(id: string) {
    // Intercept the barrel and any individual source file under @ot/config
    return id.startsWith(otConfigDir) || id === "@ot/config";
  }

  return {
    name: "stub-ui-barrel-ms",
    // resolveId runs before symlinks are followed — catches bare `"ui"` imports.
    resolveId(id: string) {
      if (id === "ui") return stubPath;
      // Redirect @ot/config (and sub-paths) to a virtual stub module
      if (id === "@ot/config" || id.startsWith("@ot/config/")) {
        return "\0ot-config-stub";
      }
    },
    load(id: string) {
      if (id === "\0ot-config-stub") return OT_CONFIG_STUB;
      // Catches @ot/ui barrel (alias-resolved) and any leftover symlink path.
      if (isBarrel(id)) {
        return `export * from ${JSON.stringify(stubPath)};`;
      }
      // Intercept any individual @ot/config source files that slipped through
      if (isOtConfig(id)) return OT_CONFIG_STUB;
      if (id.endsWith(".gql")) {
        return "const doc = { definitions: [], loc: { source: { body: '' } } }; export default doc;";
      }
    },
  };
}

export default defineConfig({
  plugins: [stubUiBarrelForMs(), react()],
  build: {
    lib: {
      entry: resolve(__dirname, "widget-src/molecular-structure-main.tsx"),
      formats: ["iife"],
      name: "MolecularStructureWidget",
    },
    outDir: "dist/widgets",
    emptyOutDir: false, // don't wipe l2g.js built by the other config
    rollupOptions: {
      output: {
        entryFileNames: "molecular-structure.js",
        inlineDynamicImports: true,
      },
    },
  },
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  resolve: {
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
      "3dmol",
    ],
    alias: {
      "@ot/ui": resolve(__dirname, "../../packages/ui/src"),
    },
  },
});
