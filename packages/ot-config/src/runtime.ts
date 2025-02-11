import { Config } from "./types";

export const getRuntimeConfig = (): Config => {
  // For Vite environment variables
  const ENV_API_URL: string | undefined = import.meta.env.VITE_API_URL;
  const ENV_AI_API_URL: string | undefined = import.meta.env.VITE_AI_API_URL;

  return {
    urlApi: window.configUrlApi ?? ENV_API_URL ?? "",
    urlAiApi: window.configOTAiApi ?? ENV_AI_API_URL ?? "",
    profile: window.configProfile ?? {},
    googleTagManagerID: window.configGoogleTagManagerID ?? null,
    efoURL: window.configEFOURL ?? "/data/ontology/efo_json/diseases_efo.jsonl",
    downloadsURL: window.configDownloadsURL ?? "/data/downloads.json",
    geneticsPortalUrl: window.configGeneticsPortalUrl ?? "https://genetics.opentargets.org",
  };
};
