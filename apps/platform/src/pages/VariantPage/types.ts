type AlleleFrequencyType = {
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
  inSilicoPredictors: {
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
};