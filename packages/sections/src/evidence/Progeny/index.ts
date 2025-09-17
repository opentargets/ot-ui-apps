import { lazy } from "react";
import { isPrivateEvidenceSection } from "@ot/constants";
import { EvidenceData } from "../types";

const id = "progeny";
export const definition = {
  id,
  name: "PROGENy",
  shortName: "PG",
  hasData: (data: EvidenceData) => (data.progeny?.count || 0) > 0,
  isPrivate: isPrivateEvidenceSection(id),
};

export { default as Summary } from "./Summary";
export const getBodyComponent = () => lazy(() => import("./Body")); 