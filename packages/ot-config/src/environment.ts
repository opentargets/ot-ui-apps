import { Environment, Config } from "./types";

export const getEnvironmentConfig = (env: Environment): Config => {
  const configs: Record<Environment, Config> = {
    development: {
      urlApi: "http://localhost:8080fefwe",
      urlAiApi: "http://localhost:8081",
      profile: {},
      googleTagManagerID: null,
      efoURL: "/data/ontology/efo_json/diseases_efo.jsonl",
      downloadsURL: "/data/downloads.json",
      geneticsPortalUrl: "https://genetics.opentargets.org",
      gitVersion: "",
    },
    production: {
      urlApi: "https://api.platform.opentargets.org",
      urlAiApi: "https://ai.platform.opentargets.org",
      profile: {},
      googleTagManagerID: "GTM-XXXXX",
      efoURL: "/data/ontology/efo_json/diseases_efo.jsonl",
      downloadsURL: "/data/downloads.json",
      geneticsPortalUrl: "https://genetics.opentargets.org",
      gitVersion: "",
    },
  };

  return configs[env];
};

// Vite environment variables
const ENV_API_URL: string | undefined = import.meta.env.VITE_API_URL;
const ENV_AI_API_URL: string | undefined = import.meta.env.VITE_AI_API_URL;
const ENV_GIT_VERSION: string | undefined = import.meta.env.VITE_GIT_VERSION;

export const getConfig = (): Config => {
  return {
    urlApi: window.configUrlApi ?? ENV_API_URL ?? "",
    urlAiApi: window.configOTAiApi ?? ENV_AI_API_URL ?? "",
    gitVersion: window.gitVersion ?? ENV_GIT_VERSION ?? "",
    profile: window.configProfile ?? { isPartnerPreview: false },
    googleTagManagerID: window.configGoogleTagManagerID ?? null,
    efoURL: window.configEFOURL ?? "/data/ontology/efo_json/diseases_efo.jsonl",
    downloadsURL: window.configDownloadsURL ?? "/data/downloads.json",
    geneticsPortalUrl: window.configGeneticsPortalUrl ?? "https://genetics.opentargets.org",
  };
};
