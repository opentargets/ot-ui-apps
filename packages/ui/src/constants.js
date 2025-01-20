import { faBook, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faDiscourse,
  faTwitterSquare,
  faLinkedin,
  faGithubSquare,
  faYoutubeSquare,
} from "@fortawesome/free-brands-svg-icons";
import config from "./config";

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
  ],
  license: {
    label: "Open Targets Platform",
    url: "https://platform.opentargets.org/",
  },
  network: [
    { label: "Science", url: "https://www.opentargets.org/science" },
    { label: "Publications", url: "https://www.opentargets.org/publications" },
    { label: "Open Targets Genetics", url: "https://genetics.opentargets.org" },
    { label: "Jobs", url: "https://www.opentargets.org/jobs" },
    { label: "Blog", url: "https://blog.opentargets.org" },
  ],
  partners: [
    { label: "EMBL-EBI", url: "https://www.ebi.ac.uk" },
    { label: "Genentech", url: "https://www.gene.com" },
    { label: "GSK", url: "https://www.gsk.com" },
    { label: "MSD", url: "https://www.msd.com/" },
    { label: "Pfizer", url: "https://pfizer.com" },
    { label: "Sanofi", url: "https://www.sanofi.com" },
    { label: "Wellcome Sanger Institute", url: "https://www.sanger.ac.uk" },
  ],
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
  ],
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
  ],
};

// Configuration for the main hamburger menu
export const mainMenuItems = config.profile.mainMenuItems ?? [
  // Projects - ppp
  {
    name: "Projects",
    url: "/projects",
    external: false,
    showOnlyPartner: true,
  },
  // Documentation
  {
    name: "Documentation",
    url: "https://platform-docs.opentargets.org/getting-started",
    external: true,
  },
  // Downloads
  {
    name: "Data downloads",
    url: "/downloads",
    external: false,
  },
  // API
  {
    name: "API",
    url: "/api",
    external: false,
  },
  // Community
  {
    name: "Community",
    url: "https://community.opentargets.org/",
    external: true,
  },
  // Contact - ppp
  {
    name: "Contact us",
    url: `mailto:${config.profile.helpdeskEmail}`,
    external: true,
    showOnlyPartner: true,
  },
];

export const particlesConfig = {
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

// App title.
export const appTitle = "Open Targets Platform";
export const appDescription =
  "The Open Targets Platform is a data integration tool that supports systematic drug target identification and prioritisation";
export const appCanonicalUrl = "https://platform.opentargets.org";

// Chunk sizes for server side pagination/download.
export const tableChunkSize = 100;
export const downloaderChunkSize = 2500;

// NA label.
export const naLabel = "N/A";

export const colorRange = config.profile.colorRange ?? [
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

export const publicationSummaryQuery = ({ pmcId, symbol, name }) => {
  const baseUrl = `${config.urlAiApi}/literature/publication/summary`;
  const body = {
    payload: {
      pmcId,
      targetSymbol: symbol,
      diseaseName: name,
    },
  };

  return { baseUrl, body };
};

export const VIEW = {
  chart: "Visualisation",
  table: "Table",
};
