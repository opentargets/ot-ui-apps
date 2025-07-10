import { lazy } from "react";
import { TargetData } from "../../types/target";

const id = "viewer_test";
export const definition = {
  id,
  name: "Viewer Test",
  shortName: "VT",
  hasData: (data: TargetData) => data.id,
};

// Components
export { default as Summary } from "./Summary";
export const getBodyComponent = () => lazy(() => import("./Body"));
