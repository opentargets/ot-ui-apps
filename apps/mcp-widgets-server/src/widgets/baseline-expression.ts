import { WidgetDef } from "./types.js";

export const baselineExpressionWidget: WidgetDef = {
  toolName: "get_baseline_expression_widget",
  description:
    "Get the interactive Baseline Expression widget for a target gene. Shows tissue and cell type " +
    "expression profiles (Summary tab) and GTEx expression variability across tissues (Variation tab).",
  inputParam: {
    name: "ensgId",
    description: "The Ensembl gene ID (e.g. ENSG00000139618)",
  },
  uriPrefix: "ui://ot-mcp/baseline-expression",
  bundleFile: "baseline-expression.js",
  title: "Baseline Expression Widget",
  successMessage: "Baseline Expression widget rendered successfully in the chat interface.",
};
