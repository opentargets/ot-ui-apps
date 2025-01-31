interface Config {
  urlApi: string;
  urlAiApi: string;
  profile: Record<string, unknown>;
  googleTagManagerID: string | null;
  efoURL: string;
  downloadsURL: string;
  geneticsPortalUrl: string;
}

const ENV_API_URL: string | undefined = import.meta.env.VITE_API_URL;
const ENV_AI_API_URL: string | undefined = import.meta.env.VITE_AI_API_URL;

declare global {
  interface Window {
    configUrlApi?: string;
    configOTAiApi?: string;
    configProfile?: Record<string, unknown>;
    configGoogleTagManagerID?: string;
    configEFOURL?: string;
    configDownloadsURL?: string;
    configGeneticsPortalUrl?: string;
  }
}

const config: Config = {
  urlApi: window.configUrlApi ?? ENV_API_URL ?? "",
  urlAiApi: window.configOTAiApi ?? ENV_AI_API_URL ?? "",
  profile: window.configProfile ?? {},
  googleTagManagerID: window.configGoogleTagManagerID ?? null,
  efoURL: window.configEFOURL ?? "/data/ontology/efo_json/diseases_efo.jsonl",
  downloadsURL: window.configDownloadsURL ?? "/data/downloads.json",
  geneticsPortalUrl: window.configGeneticsPortalUrl ?? "https://genetics.opentargets.org",
};

export default config;