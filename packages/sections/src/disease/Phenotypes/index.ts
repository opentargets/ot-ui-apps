import { lazy } from "react";

export const definition = {
  id: "phenotypes",
  name: "Clinical signs and symptoms",
  shortName: "CS",
  hasData: (data: any) => (data.phenotypes?.count || 0) > 0,
};

// Components
export { default as Summary } from "./Summary";
// Export a lazy loader function instead of the actual component
export const getBodyComponent = () => lazy(() => import("./Body"));
