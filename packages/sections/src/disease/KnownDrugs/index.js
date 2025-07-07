import { lazy } from "react";

export const definition = {
  id: "knownDrugs",
  name: "Known Drugs",
  shortName: "KD",
  hasData: data => data.knownDrugs?.count > 0 || data.knownDrugs.freeTextQuery || false,
};

// Components
export { default as Summary } from "./Summary";
// Export a lazy loader function instead of the actual component
export const getBodyComponent = () => lazy(() => import("./Body"));
