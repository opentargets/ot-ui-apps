import { lazy } from "react";
import { TargetData } from "../../types/target";

export const definition = {
  id: "safety",
  name: "Safety",
  shortName: "S",
  hasData: (data: TargetData) => (data.safetyLiabilities?.length || 0) > 0,
};

// Components
export { default as Summary } from "./Summary";
// Export a lazy loader function instead of the actual component
export const getBodyComponent = () => lazy(() => import("./Body")); 