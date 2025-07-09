import { lazy } from "react";

export const definition = {
  id: "knownDrugs",
  name: "Clinical Precedence",
  shortName: "CP",
  hasData: (data: any) => data.knownDrugs?.count > 0 || data.knownDrugs.freeTextQuery || false,
};

// Components
export { default as Summary } from "./Summary";
export const getBodyComponent = () => lazy(() => import("./Body")); 