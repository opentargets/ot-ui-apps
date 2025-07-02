interface VariantConsequence {
  id: string;
  label: string;
  proteinCoding: boolean;
}

export const VARIANT_CONSEQUENCES: VariantConsequence[] = [
  { id: "SO:0001580", label: "coding_sequence_variant", proteinCoding: false },
  { id: "SO:0001632", label: "downstream_gene_variant", proteinCoding: false },
  { id: "SO:0001589", label: "frameshift_variant", proteinCoding: true },
  { id: "SO:0001626", label: "incomplete_terminal_codon_variant", proteinCoding: false },
  { id: "SO:0001822", label: "inframe_deletion", proteinCoding: true },
  { id: "SO:0001821", label: "inframe_insertion", proteinCoding: true },
  { id: "SO:0001060", label: "intergenic_variant", proteinCoding: false },
  { id: "SO:0001627", label: "intron_variant", proteinCoding: true },
  { id: "SO:0001620", label: "mature_miRNA_variant", proteinCoding: false },
  { id: "SO:0001583", label: "missense_variant", proteinCoding: true },
  { id: "SO:0001792", label: "non_coding_transcript_exon_variant", proteinCoding: false },
  { id: "SO:0001619", label: "non_coding_transcript_variant", proteinCoding: false },
  { id: "SO:0001818", label: "protein_altering_variant", proteinCoding: true },
  { id: "SO:0001574", label: "splice_acceptor_variant", proteinCoding: true },
  { id: "SO:0002170", label: "splice_donor_region_variant", proteinCoding: true },
  { id: "SO:0001575", label: "splice_donor_variant", proteinCoding: true },
  { id: "SO:0001787", label: "splice_donor_5th_base_variant", proteinCoding: true },
  { id: "SO:0002169", label: "splice_polypyrimidine_tract_variant", proteinCoding: false },
  { id: "SO:0001630", label: "splice_region_variant", proteinCoding: true },
  { id: "SO:0002012", label: "start_lost", proteinCoding: true },
  { id: "SO:0002019", label: "start_retained_variant", proteinCoding: true },
  { id: "SO:0001587", label: "stop_gained", proteinCoding: true },
  { id: "SO:0001578", label: "stop_lost", proteinCoding: true },
  { id: "SO:0001567", label: "stop_retained_variant", proteinCoding: true },
  { id: "SO:0001819", label: "synonymous_variant", proteinCoding: false },
  { id: "SO:0001893", label: "transcript_ablation", proteinCoding: false },
  { id: "SO:0001631", label: "upstream_gene_variant", proteinCoding: false },
  { id: "SO:0001624", label: "3_prime_UTR_variant", proteinCoding: false },
  { id: "SO:0001623", label: "5_prime_UTR_variant", proteinCoding: false },
];

interface DataSource {
  datasourceId: string;
  datasourceNiceName: string;
}

export const DATASOURCES: DataSource[] = [
  { datasourceId: "eva", datasourceNiceName: "ClinVar" },
  { datasourceId: "eva_somatic", datasourceNiceName: "ClinVar-somatic" },
  { datasourceId: "gwas_credible_sets", datasourceNiceName: "GWAS credible sets" },
  { datasourceId: "mol_qtl", datasourceNiceName: "molQTL" },
  { datasourceId: "pharmgkb", datasourceNiceName: "pharmgkb" },
  { datasourceId: "uniprot_variants", datasourceNiceName: "UniProt Variants" },
];

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
    methodName: "Ensembl VEP",
    prettyName: "Ensembl VEP",
    description:
      "Pathogenicity score derived from the most severe consequence term provided by Ensembl VEP.",
    docsUrl: "https://platform-docs.opentargets.org/variant#variant-effect",
  },
};

// For TypeScript type safety when accessing methods
type VariantEffectMethodKey = keyof typeof VARIANT_EFFECT_METHODS;

export { VARIANT_EFFECT_METHODS, type VariantEffectMethod, type VariantEffectMethodKey };
