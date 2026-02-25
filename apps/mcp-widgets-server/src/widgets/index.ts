export type { WidgetDef } from "./types.js";
export { makeWidgetShell, toAnthropicTool } from "./types.js";
export { l2gWidget } from "./l2g.js";
export { variantEffectWidget } from "./variant-effect.js";
export { molecularStructureWidget } from "./molecular-structure.js";
export { gwasCredibleSetsWidget } from "./gwas-credible-sets.js";
export { sharedTraitStudiesWidget } from "./shared-trait-studies.js";

import { l2gWidget } from "./l2g.js";
import { variantEffectWidget } from "./variant-effect.js";
import { molecularStructureWidget } from "./molecular-structure.js";
import { gwasCredibleSetsWidget } from "./gwas-credible-sets.js";
import { sharedTraitStudiesWidget } from "./shared-trait-studies.js";

/** All registered widget tools — MCP server, chat handler, and /status all read from this. */
export const WIDGET_REGISTRY = [l2gWidget, variantEffectWidget, molecularStructureWidget, gwasCredibleSetsWidget, sharedTraitStudiesWidget];
