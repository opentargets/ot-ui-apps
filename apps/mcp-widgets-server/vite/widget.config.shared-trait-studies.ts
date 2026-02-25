import { resolve } from "path";
import type { Plugin } from "vite";
import { createWidgetBuildConfig, createPlatformStubsPlugin, ROOT } from "./widget.config.base";

function uiBarrelStub(): Plugin {
  const stubPath = resolve(ROOT, "widget-src/shared/stubs/ui-index.tsx");

  return {
    name: "stub-ui-barrel-shared-trait-studies",
    resolveId(id: string) {
      if (id === "ui") return stubPath;
    },
  };
}

export default createWidgetBuildConfig({
  entry: resolve(ROOT, "widget-src/shared-trait-studies/main.tsx"),
  outputName: "SharedTraitStudiesWidget",
  outputFile: "shared-trait-studies.js",
  plugins: [uiBarrelStub(), createPlatformStubsPlugin()],
});
