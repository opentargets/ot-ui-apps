import { Column, TargetPrioritisationAggregation } from "../types";

const maxClinicalTrialPhase: Column = {
  id: "maxClinicalTrialPhase",
  label: "Target in clinic",
  aggregation: TargetPrioritisationAggregation.PRECEDENCE,
  sectionId: "knownDrugs",
  description: "Target is in clinical trials for any indication",
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#target-in-clinic",
};

const isInMembrane: Column = {
  id: "isInMembrane",
  label: "Membrane protein",
  aggregation: TargetPrioritisationAggregation.TRACTABILITY,
  sectionId: "subcellularLocation",
  description: "Target is annotated to be located in the cell membrane",
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#membrane-protein",
};

const isSecreted: Column = {
  id: "isSecreted",
  label: "Secreted protein",
  aggregation: TargetPrioritisationAggregation.TRACTABILITY,
  sectionId: "subcellularLocation",
  description: "Target is annotated to be secreted",
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#secreted-protein",
};

const hasLigand: Column = {
  id: "hasLigand",
  label: "Ligand binder",
  aggregation: TargetPrioritisationAggregation.TRACTABILITY,
  sectionId: "tractability",
  description: "Target binds a specific ligand",
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#ligand-binder",
};

const hasSmallMoleculeBinder: Column = {
  id: "hasSmallMoleculeBinder",
  label: "Small molecule binder",
  aggregation: TargetPrioritisationAggregation.TRACTABILITY,
  sectionId: "tractability",
  description: "Target binds a small molecule",
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#small-molecule-binder",
};

const hasPocket: Column = {
  id: "hasPocket",
  label: "Predicted pockets",
  aggregation: TargetPrioritisationAggregation.TRACTABILITY,
  sectionId: "tractability",
  description: "Target has predicted pockets",
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#predicted-pockets",
};

const mouseOrthologMaxIdentityPercentage: Column = {
  id: "mouseOrthologMaxIdentityPercentage",
  label: "Mouse ortholog identity",
  aggregation: TargetPrioritisationAggregation.DOABILITY,
  sectionId: "compGenomics",
  description: "Mouse ortholog maximum identity percentage",
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#mouse-ortholog-identity",
};

const hasHighQualityChemicalProbes: Column = {
  id: "hasHighQualityChemicalProbes",
  label: "Chemical probes",
  aggregation: TargetPrioritisationAggregation.DOABILITY,
  sectionId: "chemicalProbes",
  description: "Availability of high quality chemical probes for the target",
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#chemical-probes",
};

const mouseKOScore: Column = {
  id: "mouseKOScore",
  label: "Mouse models",
  aggregation: TargetPrioritisationAggregation.SAFETY,
  sectionId: "mousePhenotypes",
  description: "Availability of mouse knockout models for the target",
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#mouse-models",
};

const geneticConstraint: Column = {
  id: "geneticConstraint",
  label: "Genetic constraint",
  aggregation: TargetPrioritisationAggregation.SAFETY,
  sectionId: "geneticConstraint",
  description: "Relative genetic constraint in natural populations derived from GnomAD",
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#genetic-constraint",
};

const geneEssentiality: Column = {
  id: "geneEssentiality",
  label: "Gene essentiality",
  aggregation: TargetPrioritisationAggregation.SAFETY,
  sectionId: "depMapEssentiality",
  description: "Gene is defined as core essential by the DepMap portal",
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#gene-essentiality",
};

const hasSafetyEvent: Column = {
  id: "hasSafetyEvent",
  label: "Known safety events",
  aggregation: TargetPrioritisationAggregation.SAFETY,
  sectionId: "safety",
  description: "Target associated with a curated adverse event",
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#known-adverse-events",
};

const isCancerDriverGene: Column = {
  id: "isCancerDriverGene",
  label: "Cancer driver gene",
  aggregation: TargetPrioritisationAggregation.SAFETY,
  sectionId: "cancerHallmarks",
  description: "Target is classified as an Oncogene and/or Tumor Suppressor Gene",
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#cancer-driver-gene",
};

const paralogMaxIdentityPercentage: Column = {
  id: "paralogMaxIdentityPercentage",
  label: "Paralogues",
  aggregation: TargetPrioritisationAggregation.SAFETY,
  sectionId: "compGenomics",
  description: "Paralog maximum identity percentage",
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#paralogues",
};

const tissueSpecificity: Column = {
  id: "tissueSpecificity",
  label: "Tissue specificity",
  aggregation: TargetPrioritisationAggregation.SAFETY,
  sectionId: "expressions",
  description: "HPA category types of elevated expression across tissues for the target",
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#tissue-specificity",
};

const tissueDistribution: Column = {
  id: "tissueDistribution",
  label: "Tissue distribution",
  aggregation: TargetPrioritisationAggregation.SAFETY,
  sectionId: "expressions",
  description: "HPA category types of detectable expression across tissues for the target",
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#tissue-distribution",
};

const cols: Column[] = [
  maxClinicalTrialPhase,
  isInMembrane,
  isSecreted,
  hasLigand,
  hasSmallMoleculeBinder,
  hasPocket,
  mouseOrthologMaxIdentityPercentage,
  hasHighQualityChemicalProbes,
  geneticConstraint,
  mouseKOScore,
  geneEssentiality,
  hasSafetyEvent,
  isCancerDriverGene,
  paralogMaxIdentityPercentage,
  tissueSpecificity,
  tissueDistribution,
];

export default cols;
