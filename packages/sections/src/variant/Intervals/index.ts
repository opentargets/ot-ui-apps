import { lazy } from "react";
import { Variant } from "@ot/constants";

export const definition = {
  id: "intervals",
  name: "Intervals",
  shortName: "INT",
  hasData: (data: Variant) => {
    return (data.intervals?.count || 0) > 0;
  },
};

// Components
export { default as Summary } from "./Summary";

export const getBodyComponent = () => lazy(() => import("./Body")); 