import { Evidences } from "@ot/constants";

export interface EvidenceData {
  [key: string]: Evidences;
}

export interface EvidenceSectionData {
  [key: string]: EvidenceData;
} 