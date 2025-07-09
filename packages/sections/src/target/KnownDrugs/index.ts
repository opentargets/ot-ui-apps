import { lazy } from "react";
import { TargetData } from "../../types/target";

export const definition = {
  id: "knownDrugs",
  name: "Known Drugs",
  shortName: "KD",
  hasData: (data: TargetData) => (data.knownDrugs?.count || 0) > 0 || data.knownDrugs?.freeTextQuery || false,
};

// Components
export { default as Summary } from "./Summary";
export const getBodyComponent = () => lazy(() => import("./Body")); 