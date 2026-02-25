import { resolve } from "path";
import type { Plugin } from "vite";
import { createWidgetBuildConfig, createPlatformStubsPlugin, ROOT } from "./widget.config.base";

/**
 * Stubs the "ui" workspace barrel so the L2G bundle does not pull in
 * React Router, OtAsyncTooltip, and other platform-specific deps.
 *
 * Uses the intercepting the `resolveId` hook (catches the bare "ui" import
 * before symlink resolution) in addition to the `load` hook (catches the
 * real and symlinked index paths after resolution).
 */
function uiBarrelStub(): Plugin {
  const uiIndexPath = resolve(ROOT, "../../packages/ui/src/index.tsx");
  const nodeModulesUiIndex = resolve(ROOT, "node_modules/ui/src/index.tsx");
  const stubPath = resolve(ROOT, "widget-src/shared/stubs/ui-index.tsx");

  return {
    name: "stub-ui-barrel-l2g",
    resolveId(id: string) {
      if (id === "ui") return stubPath;
    },
    load(id: string) {
      if (id === uiIndexPath || id === nodeModulesUiIndex) {
        return `export * from ${JSON.stringify(stubPath)};`;
      }
      if (id.endsWith(".gql")) {
        return "const doc = { definitions: [], loc: { source: { body: '' } } }; export default doc;";
      }
    },
  };
}

export default createWidgetBuildConfig({
  entry: resolve(ROOT, "widget-src/l2g/main.tsx"),
  outputName: "L2GWidget",
  outputFile: "l2g.js",
  // Built first in the chain — wipes dist/widgets/ before a fresh build.
  emptyOutDir: true,
  plugins: [uiBarrelStub(), createPlatformStubsPlugin()],
});
