import { resolve } from "path";
import { createWidgetBuildConfig, createPlatformStubsPlugin, ROOT } from "./widget.config.base";

function uiBarrelStub() {
  const stubPath = resolve(ROOT, "widget-src/shared/stubs/ui-index.tsx");

  return {
    name: "stub-ui-barrel-gwas",
    resolveId(id: string) {
      if (id === "ui") return stubPath;
    },
  };
}

export default createWidgetBuildConfig({
  entry: resolve(ROOT, "widget-src/gwas-credible-sets/main.tsx"),
  outputName: "GWASCredibleSetsWidget",
  outputFile: "gwas-credible-sets.js",
  plugins: [uiBarrelStub(), createPlatformStubsPlugin()],
});
