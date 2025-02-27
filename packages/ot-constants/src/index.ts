import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faBook, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faDiscourse,
  faTwitterSquare,
  faLinkedin,
  faGithubSquare,
  faYoutubeSquare,
} from "@fortawesome/free-brands-svg-icons";
import { getConfig } from "@ot/config";

const config = getConfig();

// Interfaces for structured data
interface ExternalLink {
  label: string;
  url: string;
  icon?: IconDefinition;
  external?: boolean;
  showOnlyPartner?: boolean;
}

interface MenuItem {
  name: string;
  url: string;
  external: boolean;
  showOnlyPartner?: boolean;
}

// External Links Configuration
export const externalLinks = {
  about: [
    {
      label: "Community forum",
      url: "https://community.opentargets.org",
    },
    {
      label: "Privacy notice",
      url: "https://www.ebi.ac.uk/data-protection/privacy-notice/open-targets",
    },
    {
      label: "Terms of use",
      url: "https://platform-docs.opentargets.org/terms-of-use",
    },
  ] as ExternalLink[],
  license: {
    label: "Open Targets Platform",
    url: "https://platform.opentargets.org/",
  } as ExternalLink,
  network: [
    { label: "Science", url: "https://www.opentargets.org/science" },
    { label: "Publications", url: "https://www.opentargets.org/publications" },
    { label: "Open Targets Genetics", url: "https://genetics.opentargets.org" },
    { label: "Jobs", url: "https://www.opentargets.org/jobs" },
    { label: "Blog", url: "https://blog.opentargets.org" },
  ] as ExternalLink[],
  partners: [
    { label: "EMBL-EBI", url: "https://www.ebi.ac.uk" },
    { label: "Genentech", url: "https://www.gene.com" },
    { label: "GSK", url: "https://www.gsk.com" },
    { label: "MSD", url: "https://www.msd.com/" },
    { label: "Pfizer", url: "https://pfizer.com" },
    { label: "Sanofi", url: "https://www.sanofi.com" },
    { label: "Wellcome Sanger Institute", url: "https://www.sanger.ac.uk" },
  ] as ExternalLink[],
  help: [
    {
      label: "Documentation",
      icon: faBook,
      url: "https://platform-docs.opentargets.org",
    },
    {
      label: "Community",
      icon: faDiscourse,
      url: "https://community.opentargets.org",
      external: true,
    },
    {
      label: "Contact us",
      icon: faEnvelope,
      url: `mailto: ${config.profile.helpdeskEmail}`,
      external: true,
      showOnlyPartner: true,
    },
  ] as ExternalLink[],
  social: [
    {
      icon: faTwitterSquare,
      url: "https://twitter.com/opentargets",
      label: "Go to OpenTargets twitter",
    },
    {
      icon: faLinkedin,
      url: "https://www.linkedin.com/company/open-targets",
      label: "Go to OpenTargets linkedin",
    },
    {
      icon: faYoutubeSquare,
      url: "https://www.youtube.com/opentargets",
      label: "Go to OpenTargets youtube",
    },
    {
      icon: faGithubSquare,
      url: "https://github.com/opentargets",
      label: "Go to OpenTargets github",
    },
  ] as ExternalLink[],
};

// Main Menu Items Configuration
export const mainMenuItems: MenuItem[] = config.profile.mainMenuItems ?? [
  {
    name: "Projects",
    url: "/projects",
    external: false,
    showOnlyPartner: true,
  },
  {
    name: "Documentation",
    url: "https://platform-docs.opentargets.org/getting-started",
    external: true,
  },
  {
    name: "Data downloads",
    url: "/downloads",
    external: false,
  },
  {
    name: "API",
    url: "/api",
    external: false,
  },
  {
    name: "Community",
    url: "https://community.opentargets.org/",
    external: true,
  },
  {
    name: "Contact us",
    url: `mailto:${config.profile.helpdeskEmail}`,
    external: true,
    showOnlyPartner: true,
  },
];

// App Metadata
export const appTitle = "Open Targets Platform";
export const appDescription =
  "The Open Targets Platform is a data integration tool that supports systematic drug target identification and prioritisation";
export const appCanonicalUrl = "https://platform.opentargets.org";

// Chunk Sizes
export const tableChunkSize = 100;
export const downloaderChunkSize = 2500;

// NA Label
export const naLabel = "N/A";

// Rows Per Page Options
export const defaultRowsPerPageOptions = [10, 25, 100];

// Decimal Places
export const decimalPlaces = 3;

// Clinical Phases Mapping
const clinicalPhases: { [key: string]: string } = {
  "-1": "Unknown",
  "0": "Phase 0",
  "0.5": "Phase I (Early)",
  "1": "Phase I",
  "2": "Phase II",
  "3": "Phase III",
  "4": "Phase IV",
};

export const phaseMap = (clinicalPhase: number | string): string => {
  const clinicalPhaseId = String(clinicalPhase);
  return clinicalPhases[clinicalPhaseId] || "Unknown";
};

// Source Mapping
export const sourceMap: { [key: string]: string } = {
  "FDA Information": "FDA",
  FDA: "FDA",
  "Clinical Trials Information": "ClinicalTrials.gov",
  ClinicalTrials: "ClinicalTrials.gov",
  "DailyMed Information": "DailyMed",
  DailyMed: "DailyMed",
  "ATC Information": "ATC",
  ATC: "ATC",
};

// ClinVar Star Mapping
export const clinvarStarMap: { [key: string]: number } = {
  "practice guideline": 4,
  "reviewed by expert panel": 3,
  "criteria provided, multiple submitters, no conflicts": 2,
  "criteria provided, conflicting interpretations": 1,
  "criteria provided, single submitter": 1,
  "no assertion for the individual variant": 0,
  "no assertion criteria provided": 0,
  "no assertion provided": 0,
};

// Credset Confidence Mapping
export const credsetConfidenceMap: { [key: string]: number } = {
  "SuSiE fine-mapped credible set with in-sample LD": 4,
  "SuSiE fine-mapped credible set with out-of-sample LD": 3,
  "PICS fine-mapped credible set extracted from summary statistics": 2,
  "PICS fine-mapped credible set based on reported top hit": 1,
};

// Format Mapping
export const formatMap: { [key: string]: string } = {
  json: "JSON",
  parquet: "Parquet",
};

// Study Source Mapping
export const studySourceMap: { [key: string]: string } = {
  FINNGEN: "FinnGen",
  GCST: "GWAS Catalog",
  SAIGE: "UK Biobank",
  NEALE: "UK Biobank",
};

// Variant Consequence Source
export const variantConsequenceSource = {
  VEP: {
    label: "VEP",
    tooltip: "Ensembl variant effect predictor",
  },
  ProtVar: {
    label: "ProtVar",
    tooltip: "Variant effect on protein function",
  },
  QTL: {
    label: "QTL",
    tooltip:
      "The direction is inferred from the strongest effect across all the co-localising QTLs",
  },
};

// Population Mapping
export const populationMap: { [key: string]: string } = {
  fin: "Finish",
  afr: "African",
  nfe: "non-Finnish Europeans",
  eas: "East Asian",
  amr: "Admixed American",
};

export * from "./dataTypes";
export * from "./searchSuggestions";
export * from "./partnerPreviewUtils";
export * from "./particlesBackground";
