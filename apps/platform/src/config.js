// Configuration Object
const ENV_API_URL = import.meta.env.VITE_API_URL;
const config = {
  urlApi:
    // window.configUrlApi ??
    'https://api.platform.dev.opentargets.xyz/api/v4/graphql',
  profile: window.configProfile ?? {},
  googleTagManagerID: window.configGoogleTagManagerID ?? null,
  efoURL: window.configEFOURL ?? '/data/ontology/efo_json/diseases_efo.jsonl',
  downloadsURL: window.configDownloadsURL ?? '/data/downloads.json',
  geneticsPortalUrl:
    window.configGeneticsPortalUrl ?? 'https://genetics.opentargets.org',
};

export default config;
