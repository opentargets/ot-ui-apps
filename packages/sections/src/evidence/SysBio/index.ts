import { lazy } from "react";
import { isPrivateEvidenceSection } from "@ot/constants";
import { EvidenceData } from "../types";

const id = "sysbio";
export const definition = {
  id,
  name: "SysBio",
  shortName: "SB",
  hasData: (data: EvidenceData) => (data.sysBioSummary?.count || 0) > 0,
  isPrivate: isPrivateEvidenceSection(id),
};

export { default as Summary } from "./Summary";
export const getBodyComponent = () => lazy(() => import("./Body")); 