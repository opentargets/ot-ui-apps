interface VariantEffectMethod {
  methodName: string;
  prettyName: string;
  description: string;
  docsUrl: string;
}

const VARIANT_EFFECT_METHODS: Record<string, VariantEffectMethod> = {
  AlphaMissense: {
    methodName: "AlphaMissense",
    prettyName: "AlphaMissense",
    description:
      "Model that builds on AlphaFold2 to assess the effect for missense variants across the proteome.",
    docsUrl: "https://platform-docs.opentargets.org/variant#variant-effect",
  },
  LossOfFunctionCuration: {
    methodName: "LossOfFunctionCuration",
    prettyName: "LoF curation",
    description:
      "Curation of loss-of-function variants performed by an Open Targets project team (OTAR2075).",
    docsUrl: "https://platform-docs.opentargets.org/variant#variant-effect",
  },
  FoldX: {
    methodName: "FoldX",
    prettyName: "FoldX",
    description: "Tool that predicts the impact of mutations on protein stability and structure.",
    docsUrl: "https://platform-docs.opentargets.org/variant#variant-effect",
  },
  GERP: {
    methodName: "GERP",
    prettyName: "GERP",
    description:
      "Scores used to identify regions of the genome that are evolutionarily conserved and likely to be functionally important.",
    docsUrl: "https://platform-docs.opentargets.org/variant#variant-effect",
  },
  LOFTEE: {
    methodName: "LOFTEE",
    prettyName: "LOFTEE",
    description:
      "Tool used to identify and annotate high-confidence loss-of-function, focusing on variants that likely disrupt gene function.",
    docsUrl: "https://platform-docs.opentargets.org/variant#variant-effect",
  },
  SIFT: {
    methodName: "SIFT",
    prettyName: "SIFT",
    description: "Predicting whether an amino acid substitution affects protein function.",
    docsUrl: "https://platform-docs.opentargets.org/variant#variant-effect",
  },
  VEP: {
    methodName: "VEP",
    prettyName: "VEP",
    description:
      "Pathogenicity score derived from the most severe consequence term provided by Ensembl VEP.",
    docsUrl: "https://platform-docs.opentargets.org/variant#variant-effect",
  },
};

// For TypeScript type safety when accessing methods
type VariantEffectMethodKey = keyof typeof VARIANT_EFFECT_METHODS;

export { VARIANT_EFFECT_METHODS, type VariantEffectMethod, type VariantEffectMethodKey };
