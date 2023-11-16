/*********
 * TYPES *
 *********/
type Aggregation = "Precedence" | "Tractability" | "Doability" | "Safety";

type Aggregations = {
  precedence: Aggregation;
  tractability: Aggregation;
  doability: Aggregation;
  safety: Aggregation;
};

type Column = {
  id: string;
  label: string;
  aggregation: Aggregation;
  sectionId: string;
  description: string;
  docsLink: string;
};

const aggregations: Aggregations = {
  precedence: "Precedence",
  tractability: "Tractability",
  doability: "Doability",
  safety: "Safety",
};

/***********
 * COLUMNS *
 ***********/
const maxClinicalTrialPhase: Column = {
  id: "maxClinicalTrialPhase",
  label: "Target in clinic",
  aggregation: aggregations.precedence,
  sectionId: "knownDrugs",
  description: "Target is in clinical trials for any indication",
  docsLink: "http://home.opentargets.org/aotf-documentation#target-in-clinic",
};

const isInMembrane: Column = {
  id: "isInMembrane",
  label: "Membrane protein",
  aggregation: aggregations.tractability,
  sectionId: "subcellularLocation",
  description: "Target is annotated to be located in the cell membrane",
  docsLink: "http://home.opentargets.org/aotf-documentation#membrane-protein",
};

const isSecreted: Column = {
  id: "isSecreted",
  label: "Secreted protein",
  aggregation: aggregations.tractability,
  sectionId: "subcellularLocation",
  description: "Target is annotated to be secreted",
  docsLink: "http://home.opentargets.org/aotf-documentation#secreted-protein",
};

const hasLigand: Column = {
  id: "hasLigand",
  label: "Ligand binder",
  aggregation: aggregations.tractability,
  sectionId: "tractability",
  description: "Target binds a specific ligand",
  docsLink: "http://home.opentargets.org/aotf-documentation#ligand-binder",
};

const hasSmallMoleculeBinder: Column = {
  id: "hasSmallMoleculeBinder",
  label: "Small molecule binder",
  aggregation: aggregations.tractability,
  sectionId: "tractability",
  description: "Target binds a small molecule",
  docsLink: "http://home.opentargets.org/aotf-documentation#small-molecule-binder",
};

const hasPocket: Column = {
  id: "hasPocket",
  label: "Predicted pockets",
  aggregation: aggregations.tractability,
  sectionId: "tractability",
  description: "Target has predicted pockets",
  docsLink: "http://home.opentargets.org/aotf-documentation#predicted-pockets",
};

const mouseOrthologMaxIdentityPercentage: Column = {
  id: "mouseOrthologMaxIdentityPercentage",
  label: "Mouse ortholog identity",
  aggregation: aggregations.doability,
  sectionId: "compGenomics",
  description: "Mouse ortholog maximum identity percentage",
  docsLink: "http://home.opentargets.org/aotf-documentation#mouse-ortholog-identity",
};

const hasHighQualityChemicalProbes: Column = {
  id: "hasHighQualityChemicalProbes",
  label: "Chemical probes",
  aggregation: aggregations.doability,
  sectionId: "chemicalProbes",
  description: "Availability of high quality chemical probes for the target",
  docsLink: "http://home.opentargets.org/aotf-documentation#chemical-probes",
};

const mouseKOScore: Column = {
  id: "mouseKOScore",
  label: "Mouse models",
  aggregation: aggregations.safety,
  sectionId: "mousePhenotypes",
  description: "Availability of mouse knockout models for the target",
  docsLink: "http://home.opentargets.org/aotf-documentation#mouse-ko",
};

const geneticConstraint: Column = {
  id: "geneticConstraint",
  label: "Genetic constraint",
  aggregation: aggregations.safety,
  sectionId: "geneticConstraint",
  description: "Relative genetic constraint in natural populations derived from GnomAD",
  docsLink: "http://home.opentargets.org/aotf-documentation#genetic-constraint",
};

const geneEssentiality: Column = {
  id: "geneEssentiality",
  label: "Gene essentiality",
  aggregation: aggregations.safety,
  sectionId: "depMapEssentiality",
  description: "Gene is defined as core essential by the DepMap portal",
  docsLink: "http://home.opentargets.org/aotf-documentation#gene-essentiality",
};

const hasSafetyEvent: Column = {
  id: "hasSafetyEvent",
  label: "Known adverse events",
  aggregation: aggregations.safety,
  sectionId: "safety",
  description: "Target associated with a curated adverse event",
  docsLink: "http://home.opentargets.org/aotf-documentation#known-adverse-events",
};

const isCancerDriverGene: Column = {
  id: "isCancerDriverGene",
  label: "Cancer driver gene",
  aggregation: aggregations.safety,
  sectionId: "cancerHallmarks",
  description: "Target is classified as an Oncogene and/or Tumor Suppressor Gene",
  docsLink: "http://home.opentargets.org/aotf-documentation#cancer-driver-gene",
};

const paralogMaxIdentityPercentage: Column = {
  id: "paralogMaxIdentityPercentage",
  label: "Paralogues",
  aggregation: aggregations.safety,
  sectionId: "compGenomics",
  description: "Paralog maximum identity percentage",
  docsLink: "http://home.opentargets.org/aotf-documentation#paralogues",
};

const tissueSpecificity: Column = {
  id: "tissueSpecificity",
  label: "Tissue specificity",
  aggregation: aggregations.safety,
  sectionId: "expressions",
  description: "HPA category types of elevated expression across tissues for the target",
  docsLink: "http://home.opentargets.org/aotf-documentation#tissue-specificity",
};

const tissueDistribution: Column = {
  id: "tissueDistribution",
  label: "Tissue distribution",
  aggregation: aggregations.safety,
  sectionId: "expressions",
  description: "HPA category types of detectable expression across tissues for the target",
  docsLink: "http://home.opentargets.org/aotf-documentation#tissue-distribution",
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
  mouseKOScore,
  geneticConstraint,
  geneEssentiality,
  hasSafetyEvent,
  isCancerDriverGene,
  paralogMaxIdentityPercentage,
  tissueSpecificity,
  tissueDistribution,
];

export default cols;
