import { lazy } from "react";

export const definition = {
  id: "adverseEvents",
  name: "Pharmacovigilance",
  shortName: "PV",
  hasData: (data: any) => data.adverseEvents?.count > 0 || false,
};

// Components
export { default as Summary } from "./Summary";
// Export a lazy loader function instead of the actual component
export const getBodyComponent = () => lazy(() => import("./Body")); 