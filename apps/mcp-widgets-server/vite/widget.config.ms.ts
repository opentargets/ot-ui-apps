import { resolve } from "path";
import type { Plugin } from "vite";
import { createWidgetBuildConfig, createPlatformStubsPlugin, ROOT } from "./widget.config.base";

/**
 * The molecular-structure widget needs two stub plugins:
 *
 * 1. uiBarrelStub — replaces the "ui" barrel with ui-ms-index.tsx which:
 *    - Stubs DataDownloader, ObsPlot, ViewerTrack
 *    - Re-exports the real ViewerInteraction hooks so Viewer.tsx shares the
 *      same React context as the widget's ViewerInteractionProvider
 *
 * 2. otConfigStub — stubs @ot/config (and all its sub-paths) so theme.ts
 *    does not call lighten(undefined) at module eval time.
 *    Without this stub, the bundle crashes with polished error #3.
 */
function uiBarrelStub(): Plugin {
  const uiIndexPath = resolve(ROOT, "../../packages/ui/src/index.tsx");
  const nodeModulesUiIndex = resolve(ROOT, "node_modules/ui/src/index.tsx");
  const stubPath = resolve(ROOT, "widget-src/shared/stubs/ui-ms-index.tsx");

  return {
    name: "stub-ui-barrel-ms",
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
  entry: resolve(ROOT, "widget-src/molecular-structure/main.tsx"),
  outputName: "MolecularStructureWidget",
  outputFile: "molecular-structure.js",
  // 3dmol must be deduplicated to prevent multiple instances of the same class.
  extraDedupe: ["3dmol"],
  plugins: [uiBarrelStub(), createPlatformStubsPlugin()],
});
