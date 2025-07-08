import { lazy } from "react";
import { Study } from "@ot/constants";

export const definition = {
  id: "shared_trait_studies",
  name: "Shared Trait Studies",
  shortName: "ST",
  hasData: (data: Study) => {
    return (data.credibleSets?.count || 0) > 1;
  },
};

export { default as Summary } from "./Summary";
export const getBodyComponent = () => lazy(() => import("./Body"));
