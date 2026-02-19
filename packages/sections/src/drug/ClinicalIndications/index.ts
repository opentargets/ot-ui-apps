import { lazy } from "react";

export const definition = {
  id: "clinicalIndications",
  name: "Indications",
  shortName: "I",
  hasData: (data) => data?.indications?.count > 0,
};

// Components
export { default as Summary } from "./Summary";
export const getBodyComponent = () => lazy(() => import("./Body")); 