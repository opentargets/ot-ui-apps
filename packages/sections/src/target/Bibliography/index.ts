import { lazy } from "react";
import { TargetData } from "../../types/target";

export const definition = {
  id: "bibliography",
  name: "Bibliography",
  shortName: "B",
  hasData: (data: TargetData) => (data.literatureOcurrences?.filteredCount || 0) > 0,
};

// Components
export { default as Summary } from "./Summary";
// Export a lazy loader function instead of the actual component
export const getBodyComponent = () => lazy(() => import("./Body")); 