import { lazy } from "react";

export const definition = {
  id: "indications",
  name: "Indications",
  shortName: "I",
  hasData: (data: any) => data.indications?.count > 0 || false,
};

// Components
export { default as Summary } from "./Summary";
// Export a lazy loader function instead of the actual component
export const getBodyComponent = () => lazy(() => import("./Body")); 