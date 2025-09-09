import { lazy } from "react";
import { isPrivateEvidenceSection } from "@ot/constants";
import { EvidenceData } from "../types";

const id = "slap_enrich";
export const definition = {
  id,
  name: "SLAPenrich",
  shortName: "SE",
  hasData: (data: EvidenceData) => (data.slapEnrich?.count || 0) > 0,
  isPrivate: isPrivateEvidenceSection(id),
};

export { default as Summary } from "./Summary";
export const getBodyComponent = () => lazy(() => import("./Body")); 