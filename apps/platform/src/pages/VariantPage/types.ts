
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

export type InSilicoPredictorsType = {
  cadd?: {
    phred: number;
    raw: number;
  };
  revelMax?: number;
  spliceaiDsMax?: number;
  pangolinLargestDs?: number;
  phylop?: number;
  siftMax?: number;
  polyphenMax?: number;
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
  inSilicoPredictors: InSilicoPredictorsType;
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