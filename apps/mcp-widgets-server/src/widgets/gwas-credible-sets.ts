import type { WidgetDef } from "./types.js";

export const gwasCredibleSetsWidget: WidgetDef = {
  toolName: "get_gwas_credible_sets_widget",
  description:
    "Get the interactive GWAS Credible Sets widget for a study. " +
    "Returns a Manhattan plot showing the genomic distribution of credible sets " +
    "and a table with lead variants, p-values, fine-mapping confidence, and top L2G gene scores.",
  inputParam: {
    name: "studyId",
    description: "The study ID (e.g. GCST90002357)",
  },
  uriPrefix: "ui://ot-mcp/gwas-credible-sets",
  bundleFile: "gwas-credible-sets.js",
  title: "GWAS Credible Sets Widget",
  successMessage: "GWAS Credible Sets widget rendered successfully in the chat interface.",
};
