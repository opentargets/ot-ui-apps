import { Evidence } from "sections";

const evidenceSections = new Map([
  ["eva", Evidence.EVA.getBodyComponent()],
  ["impc", Evidence.Impc.getBodyComponent()],
  ["sysbio", Evidence.SysBio.getBodyComponent()],
  ["crispr", Evidence.CRISPR.getBodyComponent()],
  ["chembl", Evidence.Chembl.getBodyComponent()],
  ["progeny", Evidence.Progeny.getBodyComponent()],
  ["encore", Evidence.OTEncore.getBodyComponent()],
  ["clingen", Evidence.ClinGen.getBodyComponent()],
  ["intogen", Evidence.IntOgen.getBodyComponent()],
  ["reactome", Evidence.Reactome.getBodyComponent()],
  ["orphanet", Evidence.Orphanet.getBodyComponent()],
  ["ot_crispr", Evidence.OTCRISPR.getBodyComponent()],
  ["europepmc", Evidence.EuropePmc.getBodyComponent()],
  ["slapenrich", Evidence.SlapEnrich.getBodyComponent()],
  ["gene_burden", Evidence.GeneBurden.getBodyComponent()],
  ["eva_somatic", Evidence.EVASomatic.getBodyComponent()],
  ["crispr_screen", Evidence.CRISPRScreen.getBodyComponent()],
  ["gene2phenotype", Evidence.Gene2Phenotype.getBodyComponent()],
  ["uniprot_variants", Evidence.UniProtVariants.getBodyComponent()],
  ["expression_atlas", Evidence.ExpressionAtlas.getBodyComponent()],
  ["genomics_england", Evidence.GenomicsEngland.getBodyComponent()],
  ["ot_crispr_validation", Evidence.OTValidation.getBodyComponent()],
  ["cancer_biomarkers", Evidence.CancerBiomarkers.getBodyComponent()],
  ["cancer_gene_census", Evidence.CancerGeneCensus.getBodyComponent()],
  ["gwas_credible_sets", Evidence.GWASCredibleSets.getBodyComponent()],
  ["uniprot_literature", Evidence.UniProtLiterature.getBodyComponent()],
]);

export default evidenceSections;
