import { lazy } from "react";

export const definition = {
  id: "clinicalIndications",
  name: "Indications",
  shortName: "I",
  hasData: (data: any) => true,  // !! UPDATE ONCE HAVE API !!
};

// Components
export { default as Summary } from "./Summary";
export const getBodyComponent = () => lazy(() => import("./Body")); 