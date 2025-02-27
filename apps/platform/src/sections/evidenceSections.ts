import { lazy } from "react";

const evidenceSections = new Map([
  ["eva", lazy(() => import("sections/src/evidence/EVA/Body"))],
  ["impc", lazy(() => import("sections/src/evidence/Impc/Body"))],
  ["sysbio", lazy(() => import("sections/src/evidence/SysBio/Body"))],
  ["crispr", lazy(() => import("sections/src/evidence/CRISPR/Body"))],
  ["chembl", lazy(() => import("sections/src/evidence/Chembl/Body"))],
  ["progeny", lazy(() => import("sections/src/evidence/Progeny/Body"))],
  ["encore", lazy(() => import("sections/src/evidence/OTEncore/Body"))],
  ["clingen", lazy(() => import("sections/src/evidence/ClinGen/Body"))],
  ["intogen", lazy(() => import("sections/src/evidence/IntOgen/Body"))],
  ["reactome", lazy(() => import("sections/src/evidence/Reactome/Body"))],
  ["orphanet", lazy(() => import("sections/src/evidence/Orphanet/Body"))],
  ["ot_crispr", lazy(() => import("sections/src/evidence/OTCRISPR/Body"))],
  ["europepmc", lazy(() => import("sections/src/evidence/EuropePmc/Body"))],
  ["slapenrich", lazy(() => import("sections/src/evidence/SlapEnrich/Body"))],
  ["gene_burden", lazy(() => import("sections/src/evidence/GeneBurden/Body"))],
  ["eva_somatic", lazy(() => import("sections/src/evidence/EVASomatic/Body"))],
  ["crispr_screen", lazy(() => import("sections/src/evidence/CRISPRScreen/Body"))],
  ["gene2phenotype", lazy(() => import("sections/src/evidence/Gene2Phenotype/Body"))],
  ["uniprot_variants", lazy(() => import("sections/src/evidence/UniProtVariants/Body"))],
  ["expression_atlas", lazy(() => import("sections/src/evidence/ExpressionAtlas/Body"))],
  ["genomics_england", lazy(() => import("sections/src/evidence/GenomicsEngland/Body"))],
  ["ot_crispr_validation", lazy(() => import("sections/src/evidence/OTValidation/Body"))],
  ["cancer_biomarkers", lazy(() => import("sections/src/evidence/CancerBiomarkers/Body"))],
  ["cancer_gene_census", lazy(() => import("sections/src/evidence/CancerGeneCensus/Body"))],
  ["gwas_credible_sets", lazy(() => import("sections/src/evidence/GWASCredibleSets/Body"))],
  ["uniprot_literature", lazy(() => import("sections/src/evidence/UniProtLiterature/Body"))],
]);

export default evidenceSections;
