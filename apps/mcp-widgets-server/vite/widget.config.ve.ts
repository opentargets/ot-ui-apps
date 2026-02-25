import { resolve } from "path";
import type { Plugin } from "vite";
import { createWidgetBuildConfig, ROOT } from "./widget.config.base";

function uiBarrelStub(): Plugin {
  const uiIndexPath = resolve(ROOT, "../../packages/ui/src/index.tsx");
  const nodeModulesUiIndex = resolve(ROOT, "node_modules/ui/src/index.tsx");
  const stubPath = resolve(ROOT, "widget-src/shared/stubs/ui-index.tsx");

  return {
    name: "stub-ui-barrel-ve",
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
  entry: resolve(ROOT, "widget-src/variant-effect/main.tsx"),
  outputName: "VariantEffectWidget",
  outputFile: "variant-effect.js",
  plugins: [uiBarrelStub()],
});
