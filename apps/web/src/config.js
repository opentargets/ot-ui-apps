// Configuration Object
const ENV_API_URL = process.env.VITE_API_URL;
const ENV_AI_API_URL = process.env.VITE_AI_API_URL;

const config = {
  urlApi: ENV_API_URL,
  urlAiApi: ENV_AI_API_URL,
  profile: {},
  googleTagManagerID: null,
  efoURL: "/data/ontology/efo_json/diseases_efo.jsonl",
  downloadsURL: "/data/downloads.json",
  geneticsPortalUrl: "https://genetics.opentargets.org",
};

export default config;
