import { lazy } from "react";
import { Variant } from "@ot/constants";

export const definition = {
  id: "pharmacogenetics",
  name: "Pharmacogenetics",
  shortName: "PGx",
  hasData: (data: Variant) => (data.pharmacogenomics?.length || 0) > 0,
};

// Components
export { default as Summary } from "./Summary";
// Export a lazy loader function instead of the actual component
export const getBodyComponent = () => lazy(() => import("./Body"));
