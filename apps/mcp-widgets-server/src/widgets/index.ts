export type { WidgetDef } from "./types.js";
export { makeWidgetShell, toAnthropicTool } from "./types.js";
export { l2gWidget } from "./l2g.js";
export { variantEffectWidget } from "./variant-effect.js";
export { molecularStructureWidget } from "./molecular-structure.js";

import { l2gWidget } from "./l2g.js";
import { variantEffectWidget } from "./variant-effect.js";
import { molecularStructureWidget } from "./molecular-structure.js";

/** All registered widget tools — MCP server, chat handler, and /status all read from this. */
export const WIDGET_REGISTRY = [l2gWidget, variantEffectWidget, molecularStructureWidget];
