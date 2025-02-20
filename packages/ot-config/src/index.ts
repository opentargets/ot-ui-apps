export * from "./types";
export * from "./environment";

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
  }
}
