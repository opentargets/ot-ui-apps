import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faDiscourse,
  faGithubSquare,
  faLinkedin,
  faTwitterSquare,
  faYoutubeSquare,
} from "@fortawesome/free-brands-svg-icons";
import { faBook, faEnvelope } from "@fortawesome/free-solid-svg-icons";
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

export const PHARM_GKB_COLOR = {
  green: "#52a237",
  yellow: "#f0c584",
  red: "#ec2746",
};

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

// External Links Configuration
export const externalLinks = {
  about: [
    {
      label: "Community forum",
      url: "https://community.opentargets.org",
    },
    {
      label: "Privacy notice",
      url: "https://www.ebi.ac.uk/data-protection/privacy-notice/embl-ebi-public-website/",
    },
    {
      label: "Terms of use",
      url: "https://platform-docs.opentargets.org/licence/terms-of-use",
    },
  ] as ExternalLink[],
  license: {
    label: "Open Targets Platform",
    url: "https://platform.opentargets.org/",
  } as ExternalLink,
  network: [
    { label: "Science", url: "https://www.opentargets.org/science" },
    { label: "Publications", url: "https://www.opentargets.org/publications" },
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
    name: "PPP Documentation",
    url: "https://home.opentargets.org/ppp-documentation",
    external: true,
    showOnlyPartner: true,
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

export const QTLStudyType = [
  "scsqtl",
  "sceqtl",
  "scpqtl",
  "sctuqtl",
  "sqtl",
  "eqtl",
  "pqtl",
  "tuqtl",
];

export const initialResponse = {
  data: null,
  error: null,
  loading: true,
};

// App Metadata
export const appTitle = "Open Targets Platform";
export const appDescription =
  "The Open Targets Platform is a data integration tool that supports systematic drug target identification and prioritisation";
export const appCanonicalUrl = "https://platform.opentargets.org";

// Chunk Sizes
export const tableChunkSize = 100;
export const table2HChunkSize = 200;
export const table3HChunkSize = 300;
export const table5HChunkSize = 500;
export const downloaderChunkSize = 2500;
export const sectionsBaseSizeQuery = 3500;
export const sections5kSizeQuery = 5000;
export const sections7kSizeQuery = 7000;
export const sections10kSizeQuery = 10000;

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
  fin: "Finnish",
  afr: "African",
  nfe: "non-Finnish Europeans",
  eas: "East Asian",
  amr: "Admixed American",
};

export const VIEW = {
  chart: "Visualisation",
  table: "Table",
};

export const getStudyTypeDisplay = (
  studyType: string | null | undefined
): string | null | undefined => {
  if (studyType) return studyType?.replace(/(qtl|gwas)/gi, (match: string) => match.toUpperCase());
  return studyType;
};

export const getStudyItemMetaData = ({
  studyType,
  credibleSetsCount,
  nSamples,
}: {
  studyType?: string;
  credibleSetsCount: number;
  nSamples: number;
}) => {
  let metaData = "";
  if (studyType) metaData += `Study type: ${getStudyTypeDisplay(studyType)}`;
  if (credibleSetsCount > -1)
    metaData += ` • Credible sets count: ${credibleSetsCount.toLocaleString()}`;
  if (studyType) metaData += ` • Sample size: ${nSamples.toLocaleString()}`;

  return metaData;
};

export const getGenomicLocation = (
  genomicLocation:
    | {
        chromosome?: string;
        start?: number;
        end?: number;
        strand?: number;
      }
    | null
    | undefined
) => {
  /****
   * TODO: add GRCh38 to this function
   * check all the locations we are using this
   * option 1:  getGenomicLocation() -> ["GRCh38", "chromosome-string"]
   * option 2:  getGenomicLocation("GRCh38") -> "GRCh38|chromosome-string"
   ****/
  return `${genomicLocation?.chromosome}:${genomicLocation?.start}-${genomicLocation?.end},${
    Math.sign(genomicLocation?.strand ?? 1) === 1 ? "+" : "-"
  }`;
};
export * from "./alphaFold";
export * from "./dataTypes";
export * from "./particlesBackground";
export * from "./partnerPreviewUtils";
export * from "./searchSuggestions";
export * from "./types/graphql-types";
export * from "./types/response";
export * from "./variant";
