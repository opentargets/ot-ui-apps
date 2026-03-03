import { resolve } from "path";
import type { Plugin } from "vite";
import { createWidgetBuildConfig, createPlatformStubsPlugin, ROOT } from "./widget.config.base";

function uiBarrelStub(): Plugin {
  const stubPath = resolve(ROOT, "widget-src/shared/stubs/ui-ms-index.tsx");
  return {
    name: "stub-ui-barrel-ms",
    resolveId(id: string) {
      if (id === "ui") return stubPath;
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
