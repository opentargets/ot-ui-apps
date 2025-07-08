import { lazy } from "react";
import { Variant } from "@ot/constants";

export const definition = {
  id: "variant_effect_predictor",
  name: "Transcript consequences",
  shortName: "TC",
  hasData: (data: Variant) => (data.transcriptConsequences?.length || 0) > 0,
};

// Components
export { default as Summary } from "./Summary";
// Export a lazy loader function instead of the actual component
export const getBodyComponent = () => lazy(() => import("./Body"));
