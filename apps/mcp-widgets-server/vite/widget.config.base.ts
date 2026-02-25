import { defineConfig } from "vite";
import type { UserConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

/** Absolute path to the package root (apps/mcp-widgets-server). */
export const ROOT = resolve(__dirname, "..");

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

export function createWidgetBuildConfig(opts: WidgetBuildOptions): UserConfig {
  return defineConfig({
    plugins: [...opts.plugins, react()],
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
        "@ot/ui": resolve(ROOT, "../../packages/ui/src"),
      },
    },
  });
}
