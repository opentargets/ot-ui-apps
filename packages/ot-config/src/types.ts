export interface Config {
  urlApi: string;
  urlAiApi: string;
  profile: Record<string, unknown>;
  googleTagManagerID: string | null;
  downloadsURL: string;
  geneticsPortalUrl: string;
  gitVersion: string;
}

export type Environment = "development" | "production";
