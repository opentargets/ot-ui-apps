import { lazy } from "react";
import { isPrivateEvidenceSection } from "@ot/constants";
import { EvidenceData } from "../types";

const id = "chembl";
export const definition = {
  id,
  name: "ChEMBL",
  shortName: "CE",
  hasData: (data: EvidenceData) => (data.chembl?.count || 0) > 0,
  isPrivate: isPrivateEvidenceSection(id),
};

export { default as Summary } from "./Summary";
export const getBodyComponent = () => lazy(() => import("./Body")); 