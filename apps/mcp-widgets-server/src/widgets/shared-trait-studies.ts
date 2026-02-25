import { WidgetDef } from "./types.js";

export const sharedTraitStudiesWidget: WidgetDef = {
  toolName: "get_shared_trait_studies_widget",
  description:
    "Get the interactive Shared Trait Studies widget for a study. Shows other GWAS studies " +
    "that share the same disease/phenotype associations, including sample sizes, cohorts, and publications.",
  inputParam: {
    name: "studyId",
    description: "The study ID (e.g. GCST90002357)",
  },
  uriPrefix: "ui://ot-mcp/shared-trait-studies",
  bundleFile: "shared-trait-studies.js",
  title: "Shared Trait Studies Widget",
  successMessage: "Shared Trait Studies widget rendered successfully in the chat interface.",
};
