import { lazy } from "react";

export const definition = {
  id: "mechanismsOfAction",
  name: "Mechanisms of Action",
  shortName: "MA",
  hasData: (data: any) =>
    (data.mechanismsOfAction?.uniqueActionTypes.length > 0 &&
      data.mechanismsOfAction?.uniqueTargetTypes.length > 0) ||
    false,
};

// Components
export { default as Summary } from "./Summary";
// Export a lazy loader function instead of the actual component
export const getBodyComponent = () => lazy(() => import("./Body")); 