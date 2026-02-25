import type { WidgetDef } from "./types.js";

export const l2gWidget: WidgetDef = {
  toolName: "get_l2g_widget",
  description:
    "Get the interactive Locus-to-Gene (L2G) heatmap widget for a credible set. " +
    "Returns a rich interactive visualisation showing gene prioritisation scores and " +
    "SHAP feature-group contributions.",
  inputParam: {
    name: "studyLocusId",
    description: "The study locus ID of the credible set",
  },
  uriPrefix: "ui://ot-mcp/l2g",
  bundleFile: "l2g.js",
  title: "L2G Widget",
  successMessage: "L2G widget rendered successfully in the chat interface.",
};
