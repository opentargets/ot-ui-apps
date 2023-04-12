// Configuration Object
const config = {
  urlApi: window.configUrlApi ?? import.meta.env.VITE_API_URL,
  profile: window.configProfile ?? {},
  googleTagManagerID: window.configGoogleTagManagerID ?? null,
  efoURL: window.configEFOURL ?? '/data/ontology/efo_json/diseases_efo.jsonl',
  downloadsURL: window.configDownloadsURL ?? '/data/downloads.json',
  geneticsPortalUrl:
    window.configGeneticsPortalUrl ?? 'https://genetics.opentargets.org',
};

export default config;
