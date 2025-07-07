import { lazy } from "react";

export const definition = {
  id: "ontology",
  name: "Ontology",
  shortName: "O",
  hasData: data => data.id,
};

// Components
export { default as Summary } from "./Summary";
// Export a lazy loader function instead of the actual component
export const getBodyComponent = () => lazy(() => import("./Body"));
