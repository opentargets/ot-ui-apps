import { resolve } from "path";
import type { Plugin } from "vite";
import { createWidgetBuildConfig, ROOT } from "./widget.config.base";

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

function otConfigStub(): Plugin {
  const otConfigDir = resolve(ROOT, "../../packages/ot-config/src");

  return {
    name: "stub-ot-config-ms",
    resolveId(id: string) {
      if (id === "@ot/config" || id.startsWith("@ot/config/")) return "\0ot-config-stub";
    },
    load(id: string) {
      if (id === "\0ot-config-stub") return OT_CONFIG_STUB;
      if (id.startsWith(otConfigDir)) return OT_CONFIG_STUB;
    },
  };
}

export default createWidgetBuildConfig({
  entry: resolve(ROOT, "widget-src/molecular-structure/main.tsx"),
  outputName: "MolecularStructureWidget",
  outputFile: "molecular-structure.js",
  // 3dmol must be deduplicated to prevent multiple instances of the same class.
  extraDedupe: ["3dmol"],
  plugins: [uiBarrelStub(), otConfigStub()],
});
