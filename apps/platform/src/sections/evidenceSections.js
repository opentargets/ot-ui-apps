import { lazy } from "react";

const evidenceSections = new Map([
  ["chembl", lazy(() => import("sections/src/evidence/Chembl/Body"))],
  ["clingen", lazy(() => import("sections/src/evidence/ClinGen/Body"))],
  ["crispr", lazy(() => import("sections/src/evidence/CRISPR/Body"))],
  ["impc", lazy(() => import("sections/src/evidence/Impc/Body"))],
  ["intogen", lazy(() => import("sections/src/evidence/IntOgen/Body"))],
  ["gene_burden", lazy(() => import("sections/src/evidence/GeneBurden/Body"))],
  ["orphanet", lazy(() => import("sections/src/evidence/Orphanet/Body"))],
  ["ot_crispr", lazy(() => import("sections/src/evidence/OTCRISPR/Body"))],
  ["encore", lazy(() => import("sections/src/evidence/OTEncore/Body"))],
  ["europepmc", lazy(() => import("sections/src/evidence/EuropePmc/Body"))],
  ["eva", lazy(() => import("sections/src/evidence/EVA/Body"))],
  ["eva_somatic", lazy(() => import("sections/src/evidence/EVASomatic/Body"))],
  ["progeny", lazy(() => import("sections/src/evidence/Progeny/Body"))],
  ["reactome", lazy(() => import("sections/src/evidence/Reactome/Body"))],
  ["slapenrich", lazy(() => import("sections/src/evidence/SlapEnrich/Body"))],
  ["sysbio", lazy(() => import("sections/src/evidence/SysBio/Body"))],
  ["cancer_biomarkers", lazy(() => import("sections/src/evidence/CancerBiomarkers/Body"))],
  ["cancer_gene_census", lazy(() => import("sections/src/evidence/CancerGeneCensus/Body"))],
  ["crispr_screen", lazy(() => import("sections/src/evidence/CRISPRScreen/Body"))],
  ["expression_atlas", lazy(() => import("sections/src/evidence/ExpressionAtlas/Body"))],
  ["gene2phenotype", lazy(() => import("sections/src/evidence/Gene2Phenotype/Body"))],
  ["genomics_england", lazy(() => import("sections/src/evidence/GenomicsEngland/Body"))],
  ["ot_genetics_portal", lazy(() => import("sections/src/evidence/OTGenetics/Body"))],
  ["ot_crispr_validation", lazy(() => import("sections/src/evidence/OTValidation/Body"))],
  ["uniprot_literature", lazy(() => import("sections/src/evidence/UniProtLiterature/Body"))],
  ["uniprot_variants", lazy(() => import("sections/src/evidence/UniProtVariants/Body"))],
]);

export default evidenceSections;
