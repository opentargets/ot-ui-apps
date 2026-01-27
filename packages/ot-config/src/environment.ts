import type { Config, Environment } from "./types";

export const getEnvironmentConfig = (env: Environment): Config => {
  const configs: Record<Environment, Config> = {
    development: {
      urlApi: "http://localhost:8080",
      urlAiApi: "http://localhost:8081",
      profile: {},
      googleTagManagerID: null,
      geneticsPortalUrl: "https://genetics.opentargets.org",
      gitVersion: "",
      releaseNotesUrl: "https://platform-docs.opentargets.org/release-notes",
    },
    production: {
      urlApi: "https://api.platform.opentargets.org",
      urlAiApi: "https://ai.platform.opentargets.org",
      profile: {},
      googleTagManagerID: "GTM-XXXXX",
      geneticsPortalUrl: "https://genetics.opentargets.org",
      gitVersion: "",
      releaseNotesUrl: "https://platform-docs.opentargets.org/release-notes",
    },
  };

  return configs[env];
};

// Vite environment variables
const ENV_API_URL: string | undefined = import.meta.env.VITE_API_URL;
const ENV_AI_API_URL: string | undefined = import.meta.env.VITE_AI_API_URL;
const ENV_GIT_VERSION: string | undefined = import.meta.env.VITE_GIT_VERSION;
const ENV_RELEASE_NOTES_URL: string | undefined = import.meta.env.VITE_RELEASE_NOTES_URL;

export const getConfig = (): Config => {
  return {
    urlApi: window.configUrlApi ?? ENV_API_URL ?? "",
    urlAiApi: window.configOTAiApi ?? ENV_AI_API_URL ?? "",
    gitVersion: window.gitVersion ?? ENV_GIT_VERSION ?? "",
    profile: window.configProfile ?? { isPartnerPreview: false },
    googleTagManagerID: window.configGoogleTagManagerID ?? null,
    geneticsPortalUrl: window.configGeneticsPortalUrl ?? "https://genetics.opentargets.org",
    releaseNotesUrl: window.configReleaseNotesUrl ?? ENV_RELEASE_NOTES_URL ?? "https://platform-docs.opentargets.org/release-notes/production",
  };
};
