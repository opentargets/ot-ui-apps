// packages/config/src/environment.ts
export type Environment = "development" | "production";

export interface ClientConfig {
  apiUrl: string;
  graphqlUrl: string;
  platform: string;
  version: string;
}

export const getClientConfig = (env: Environment): ClientConfig => {
  const configs: Record<Environment, ClientConfig> = {
    development: {
      apiUrl: "http://localhost:8080",
      graphqlUrl: "http://localhost:8080/graphql",
      platform: "platform.dev.targetvalidation.org",
      version: process.env.APP_VERSION || "dev",
    },
    production: {
      apiUrl: "https://api.platform.opentargets.org",
      graphqlUrl: "https://api.platform.opentargets.org/graphql",
      platform: "platform.opentargets.org",
      version: process.env.APP_VERSION || "production",
    },
  };

  return configs[env];
};
