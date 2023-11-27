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
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#target-in-clinic",
};

const isInMembrane: Column = {
  id: "isInMembrane",
  label: "Membrane protein",
  aggregation: aggregations.tractability,
  sectionId: "subcellularLocation",
  description: "Target is annotated to be located in the cell membrane",
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#membrane-protein",
};

const isSecreted: Column = {
  id: "isSecreted",
  label: "Secreted protein",
  aggregation: aggregations.tractability,
  sectionId: "subcellularLocation",
  description: "Target is annotated to be secreted",
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#secreted-protein",
};

const hasLigand: Column = {
  id: "hasLigand",
  label: "Ligand binder",
  aggregation: aggregations.tractability,
  sectionId: "tractability",
  description: "Target binds a specific ligand",
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#ligand-binder",
};

const hasSmallMoleculeBinder: Column = {
  id: "hasSmallMoleculeBinder",
  label: "Small molecule binder",
  aggregation: aggregations.tractability,
  sectionId: "tractability",
  description: "Target binds a small molecule",
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#small-molecule-binder",
};

const hasPocket: Column = {
  id: "hasPocket",
  label: "Predicted pockets",
  aggregation: aggregations.tractability,
  sectionId: "tractability",
  description: "Target has predicted pockets",
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#predicted-pockets",
};

const mouseOrthologMaxIdentityPercentage: Column = {
  id: "mouseOrthologMaxIdentityPercentage",
  label: "Mouse ortholog identity",
  aggregation: aggregations.doability,
  sectionId: "compGenomics",
  description: "Mouse ortholog maximum identity percentage",
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#mouse-ortholog-identity",
};

const hasHighQualityChemicalProbes: Column = {
  id: "hasHighQualityChemicalProbes",
  label: "Chemical probes",
  aggregation: aggregations.doability,
  sectionId: "chemicalProbes",
  description: "Availability of high quality chemical probes for the target",
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#chemical-probes",
};

const mouseKOScore: Column = {
  id: "mouseKOScore",
  label: "Mouse models",
  aggregation: aggregations.safety,
  sectionId: "mousePhenotypes",
  description: "Availability of mouse knockout models for the target",
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#mouse-models",
};

const geneticConstraint: Column = {
  id: "geneticConstraint",
  label: "Genetic constraint",
  aggregation: aggregations.safety,
  sectionId: "geneticConstraint",
  description: "Relative genetic constraint in natural populations derived from GnomAD",
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#genetic-constraint",
};

const geneEssentiality: Column = {
  id: "geneEssentiality",
  label: "Gene essentiality",
  aggregation: aggregations.safety,
  sectionId: "depMapEssentiality",
  description: "Gene is defined as core essential by the DepMap portal",
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#gene-essentiality",
};

const hasSafetyEvent: Column = {
  id: "hasSafetyEvent",
  label: "Known adverse events",
  aggregation: aggregations.safety,
  sectionId: "safety",
  description: "Target associated with a curated adverse event",
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#known-adverse-events",
};

const isCancerDriverGene: Column = {
  id: "isCancerDriverGene",
  label: "Cancer driver gene",
  aggregation: aggregations.safety,
  sectionId: "cancerHallmarks",
  description: "Target is classified as an Oncogene and/or Tumor Suppressor Gene",
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#cancer-driver-gene",
};

const paralogMaxIdentityPercentage: Column = {
  id: "paralogMaxIdentityPercentage",
  label: "Paralogues",
  aggregation: aggregations.safety,
  sectionId: "compGenomics",
  description: "Paralog maximum identity percentage",
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#paralogues",
};

const tissueSpecificity: Column = {
  id: "tissueSpecificity",
  label: "Tissue specificity",
  aggregation: aggregations.safety,
  sectionId: "expressions",
  description: "HPA category types of elevated expression across tissues for the target",
  docsLink: "https://platform-docs.opentargets.org/target-prioritisation#tissue-specificity",
};

const tissueDistribution: Column = {
  id: "tissueDistribution",
  label: "Tissue distribution",
  aggregation: aggregations.safety,
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
