import { lazy } from "react";
import { TargetData } from "../../types/target";

export const definition = {
  id: "expressions",
  name: "Baseline Expression",
  shortName: "BE",
  hasData: (data: TargetData) => {
    const hasRNA = data.expressions?.some(d => (d.rna?.level || 0) >= 0) || false;
    const hasProtein = data.expressions?.some(d => (d.protein?.level || 0) >= 0) || false;
    // TODO:
    // the check for gtex data should be remove if/when
    // we stop checking for data on switching tab (see comment in GtexTab)
    const hasGtex = data.expressions?.some(d => d.tissueSiteDetailId) || false;
    return hasRNA || hasProtein || hasGtex;
  },
};

// Components
export { default as Summary } from "./Summary";

export const getBodyComponent = () => lazy(() => import("./Body")); 