import { Environment, Config } from "./types";

export const getEnvironmentConfig = (env: Environment): Config => {
  const configs: Record<Environment, Config> = {
    development: {
      urlApi: "http://localhost:8080",
      urlAiApi: "http://localhost:8081",
      profile: {},
      googleTagManagerID: null,
      efoURL: "/data/ontology/efo_json/diseases_efo.jsonl",
      downloadsURL: "/data/downloads.json",
      geneticsPortalUrl: "https://genetics.opentargets.org",
    },
    production: {
      urlApi: "https://api.platform.opentargets.org",
      urlAiApi: "https://ai.platform.opentargets.org",
      profile: {},
      googleTagManagerID: "GTM-XXXXX",
      efoURL: "/data/ontology/efo_json/diseases_efo.jsonl",
      downloadsURL: "/data/downloads.json",
      geneticsPortalUrl: "https://genetics.opentargets.org",
    },
  };

  return configs[env];
};
