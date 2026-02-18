import { resolve } from "node:path";
import type { CodegenConfig } from "@graphql-codegen/cli";
import { config as dotenvConfig } from "dotenv";

// Load .env from apps/platform directory
dotenvConfig({ path: resolve(__dirname, "../../apps/platform/.env") });

const { VITE_API_URL } = process.env;

if (!VITE_API_URL) {
  throw new Error("VITE_API_URL environment variable is not set in .env file");
}

/**
 * Per-directory type generation with namespaces.
 * Each entity's types are wrapped in a namespace (Disease, Drug, Target, etc.)
 * Import as: import { Disease } from '@ot/constants/types/disease'
 * Use as: Disease.KnownDrugsQuery
 */

const sharedPluginConfig = {
  skipTypename: false,
  withHooks: false,
  withHOC: false,
  withComponent: false,
  dedupeFragments: true,
  onlyOperationTypes: false,
  avoidOptionals: false,
  maybeValue: "T | null",
  namingConvention: {
    typeNames: "keep",
    enumValues: "keep",
  },
  skipDocumentsValidation: true,
};

const config: CodegenConfig = {
  overwrite: true,
  schema: `${VITE_API_URL}`,
  errorsOnly: false,
  generates: {
    "./src/types/graphql.ts": {
      // documents: ["../../packages/sections/src/**/*.{ts,tsx,jsx,js,gql,graphql}"],
      plugins: ['typescript','typescript-operations','typescript-graphql-request'],
      config: { gqlTagName: 'gql', rawRequest: false }
    },
  }
};

export default config;
