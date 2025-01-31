import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faBook, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faDiscourse,
  faTwitterSquare,
  faLinkedin,
  faGithubSquare,
  faYoutubeSquare,
} from "@fortawesome/free-brands-svg-icons";
import config from "./config";

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

interface ParticlesConfig {
  particles: {
    number: {
      value: number;
      density: {
        enable: boolean;
        value_area: number;
      };
    };
    color: {
      value: string;
    };
    shape: {
      type: string;
      stroke: {
        width: number;
        color: string;
      };
      polygon?: {
        nb_sides: number;
      };
      image?: {
        src: string;
        width: number;
        height: number;
      };
    };
    opacity: {
      value: number;
      random: boolean;
      anim: {
        enable: boolean;
        speed: number;
        opacity_min: number;
        sync: boolean;
      };
    };
    size: {
      value: number;
      random: boolean;
      anim: {
        enable: boolean;
        speed: number;
        size_min: number;
        sync: boolean;
      };
    };
    line_linked: {
      enable: boolean;
      distance: number;
      color: string;
      opacity: number;
      width: number;
    };
    move: {
      enable: boolean;
      speed: number;
      direction: string;
      random: boolean;
      straight: boolean;
      out_mode: string;
      bounce: boolean;
      attract: {
        enable: boolean;
        rotateX: number;
        rotateY: number;
      };
    };
  };
  interactivity: {
    detect_on: string;
    events: {
      onhover: {
        enable: boolean;
        mode: string;
      };
      onclick: {
        enable: boolean;
        mode: string;
      };
      resize: boolean;
    };
    modes: {
      grab: {
        distance: number;
        line_linked: {
          opacity: number;
        };
      };
      bubble: {
        distance: number;
        size: number;
        duration: number;
        opacity: number;
        speed: number;
      };
      repulse: {
        distance: number;
        duration: number;
      };
      push: {
        particles_nb: number;
      };
      remove: {
        particles_nb: number;
      };
    };
  };
  retina_detect: boolean;
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

// Particles Configuration
export const particlesConfig: ParticlesConfig = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800,
      },
    },
    color: {
      value: "#ffffff",
    },
    shape: {
      type: "circle",
      stroke: {
        width: 0,
        color: "#000000",
      },
      polygon: {
        nb_sides: 5,
      },
      image: {
        src: "img/github.svg",
        width: 100,
        height: 100,
      },
    },
    opacity: {
      value: 0.5,
      random: true,
      anim: {
        enable: false,
        speed: 1,
        opacity_min: 0.1,
        sync: false,
      },
    },
    size: {
      value: 15.782983970406905,
      random: true,
      anim: {
        enable: false,
        speed: 40,
        size_min: 0.1,
        sync: false,
      },
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#ffffff",
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 0.3,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200,
      },
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: false,
        mode: "repulse",
      },
      onclick: {
        enable: false,
        mode: "push",
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 400,
        line_linked: {
          opacity: 1,
        },
      },
      bubble: {
        distance: 400,
        size: 40,
        duration: 2,
        opacity: 0.6793206793206793,
        speed: 3,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
      push: {
        particles_nb: 4,
      },
      remove: {
        particles_nb: 2,
      },
    },
  },
  retina_detect: true,
};

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

// Color Range
export const colorRange: string[] = config.profile.colorRange ?? [
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
