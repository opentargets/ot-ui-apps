import { lazy } from "react";
import { Study } from "@ot/constants";

export const definition = {
  id: "qtl_credible_sets",
  name: "molQTL Credible Sets",
  shortName: "QT",
  hasData: (data: Study) => (data.credibleSets?.count || 0) > 0,
};

export { default as Summary } from "./Summary";
export const getBodyComponent = () => lazy(() => import("./Body"));
