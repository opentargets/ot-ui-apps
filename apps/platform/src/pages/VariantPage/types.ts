
// ========
// Metadata
// ========

export type AlleleFrequencyType = {
  populationName: string;
  alleleFrequency: number;
};

type VepType = {
  mostSevereConsequence: string;
  transcriptConsequences: {
    aminoAcids: string;
    consequenceTerms: string[];
    geneId: string;
  }[];
};

export type MetadataType = {
  variantId: string,
  chromosome: string,
  position: number;
  chromosomeB37?: string,
  positionB37?: number;
  referenceAllele: string,
  alternateAllele: string,
  rsIds: string[];
  alleleType: string;
  alleleFrequencies: AlleleFrequencyType[];
  vep: VepType;
};

// ==================
// InSilicoPredictors
// ==================

export type InSilicoPredictorsType = {
  [index: number]: {
    method: string,
    assesessment?: string,
    flag?: string,
    score?: number,
  }
};

// =======
// ClinVar
// =======

export type ClinVarType = {
  alleleOrigins: string[],
  alleleRequirements: string[],
  approvedSymbol: string,
  clinicalSignificances: string[],
  cohortPhenotypes: string[],
  confidence: string,
  directionOnTrait: "risk",
  "disease.id": string,
  "disease.name": string,
  diseaseFromSource: string,
  diseaseId: string,
  diseaseName: string,
  literature: string[],
  studyId: string,
  targetId: string,
  variantId: string,
};

// ===============
// UniProtVariants
// ===============

export type UniProtVariants = {
  variantId: string,
  confidence: string,
  diseaseFromSource: string,
  literature: string[],
  targetFromSourceId: string,
  "target.id": string,
  "target.approvedSymbol": string,
  "disease.id": string,
  "disease.name": string,
};  