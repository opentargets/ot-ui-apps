import type { WidgetDef } from "./types.js";

export const variantEffectWidget: WidgetDef = {
  toolName: "get_variant_effect_widget",
  description:
    "Get the interactive Variant Effect widget for a variant. " +
    "Shows in-silico predictor scores (AlphaMissense, SIFT, LOFTEE, FoldX, GERP, VEP, LoF curation) " +
    "as a normalised dot plot ranging from likely benign to likely deleterious.",
  inputParam: {
    name: "variantId",
    description: "The variant ID (e.g. 19_44908822_C_T)",
  },
  uriPrefix: "ui://ot-mcp/variant-effect",
  bundleFile: "variant-effect.js",
  title: "Variant Effect Widget",
  successMessage: "Variant effect widget rendered successfully in the chat interface.",
};
