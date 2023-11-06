// App title.
export const appTitle = "Open Targets Platform";
export const appDescription =
  "The Open Targets Platform is a data integration tool that supports systematic drug target identification and prioritisation";
export const appCanonicalUrl = "https://platform.opentargets.org";

// Chunk sizes for server side pagination/download.
export const tableChunkSize = 100;
export const downloaderChunkSize = 2500;
export const sectionsBaseSizeQuery = 3500;

// NA label.
export const naLabel = "N/A";

export const colorRange = [
  "#e5edf4",
  "#ccdcea",
  "#b2cbe0",
  "#99b9d6",
  "#7fa8cc",
  "#6697c1",
  "#4c85b7",
  "#3274ad",
  "#1963a3",
  "#005299",
];

export const defaultRowsPerPageOptions = [10, 25, 100];

export const decimalPlaces = 3;

const clinicalPhases = {
  "-1": "Unknown",
  0: "Phase 0",
  0.5: "Phase I (Early)",
  1: "Phase I",
  2: "Phase II",
  3: "Phase III",
  4: "Phase IV",
};

export const phaseMap = clinicalPhase => {
  const clinicalPhaseId = String(clinicalPhase);
  return clinicalPhases[clinicalPhaseId];
};

export const sourceMap = {
  "FDA Information": "FDA",
  FDA: "FDA",
  "Clinical Trials Information": "ClinicalTrials.gov",
  ClinicalTrials: "ClinicalTrials.gov",
  "DailyMed Information": "DailyMed",
  DailyMed: "DailyMed",
  "ATC Information": "ATC",
  ATC: "ATC",
};

export const clinvarStarMap = {
  "practice guideline": 4,
  "reviewed by expert panel": 3,
  "criteria provided, multiple submitters, no conflicts": 2,
  "criteria provided, conflicting interpretations": 1,
  "criteria provided, single submitter": 1,
  "no assertion for the individual variant": 0,
  "no assertion criteria provided": 0,
  "no assertion provided": 0,
};

export const formatMap = {
  json: "JSON",
  parquet: "Parquet",
};

export const studySourceMap = {
  FINNGEN: "FinnGen",
  GCST: "GWAS Catalog",
  SAIGE: "UK Biobank",
  NEALE: "UK Biobank",
};

export const variantConsequenceSource = {
  VEP: {
    label: "VEP",
    tooltip: "Ensembl variant effect predictor",
  },
  ProtVar: { label: "ProtVar", tooltip: "Variant effect on protein function" },
  QTL: {
    label: "QTL",
    tooltip:
      "The direction is inferred from the strongest effect across all the co-localising QTLs",
  },
};
