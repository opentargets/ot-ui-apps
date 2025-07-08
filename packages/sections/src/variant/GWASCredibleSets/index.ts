import { lazy } from "react";
import { Variant } from "@ot/constants";

export const definition = {
  id: "gwas_credible_sets",
  name: "GWAS Credible Sets",
  shortName: "GW",
  // @ts-expect-error TODO: fix this
  hasData: (data: Variant) => (data.gwasCredibleSets?.count || 0) > 0,
};

// Components
export { default as Summary } from "./Summary";
// Export a lazy loader function instead of the actual component
export const getBodyComponent = () => lazy(() => import("./Body"));
