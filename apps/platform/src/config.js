// Configuration Object
// TODO : update in config object
const ENV_API_URL = "https://api.platform.mbdev.opentargets.xyz/api/v4/graphql";
const config = {
  urlApi: window.configUrlApi ?? ENV_API_URL,
  profile: window.configProfile ?? {},
  googleTagManagerID: window.configGoogleTagManagerID ?? null,
  efoURL: window.configEFOURL ?? '/data/ontology/efo_json/diseases_efo.jsonl',
  downloadsURL: window.configDownloadsURL ?? '/data/downloads.json',
  geneticsPortalUrl:
    window.configGeneticsPortalUrl ?? 'https://genetics.opentargets.org',
};

export default config;
