export * from "./types";
export * from "./environment";
export * from "./theme";

// Add window augmentation
declare global {
  interface Window {
    configUrlApi?: string;
    configOTAiApi?: string;
    configProfile?: Record<string, unknown>;
    configGoogleTagManagerID?: string;
    configEFOURL?: string;
    configDownloadsURL?: string;
    configGeneticsPortalUrl?: string;
    gitVersion?: string;
  }
}
