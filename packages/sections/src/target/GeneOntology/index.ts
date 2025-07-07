import { lazy } from "react";
import { TargetData } from "../../types/target";

export const definition = {
  id: "geneOntology",
  name: "Gene Ontology",
  shortName: "GO",
  hasData: (data: TargetData) => (data.geneOntology?.length || 0) > 0,
};

// Components
export { default as Summary } from "./Summary";
// Export a lazy loader function instead of the actual component
export const getBodyComponent = () => lazy(() => import("./Body")); 