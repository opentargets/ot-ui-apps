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
  ignoreNoDocuments: true,
  errorsOnly: false,
  generates: {
    // Disease entity types
    "./src/types/disease.ts": {
      documents: ["../../packages/sections/src/disease/**/*.{ts,tsx,jsx,js,gql,graphql}"],
      plugins: [
        "typescript",
        "typescript-operations",
        {
          add: {
            content: "export namespace Disease {",
          },
        },
        {
          add: {
            placement: "append",
            content: "}",
          },
        },
      ],
      config: sharedPluginConfig,
    },
    // Drug entity types
    "./src/types/drug.ts": {
      documents: ["../../packages/sections/src/drug/**/*.{ts,tsx,jsx,js,gql,graphql}"],
      plugins: [
        "typescript",
        "typescript-operations",
        {
          add: {
            content: "export namespace Drug {",
          },
        },
        {
          add: {
            placement: "append",
            content: "}",
          },
        },
      ],
      config: sharedPluginConfig,
    },
    // Target entity types
    "./src/types/target.ts": {
      documents: [
        "../../packages/sections/src/target/**/*.{ts,tsx,jsx,js,gql,graphql}",
        "!../../packages/sections/src/target/BaselineExpression/**",
      ],
      plugins: [
        "typescript",
        "typescript-operations",
        {
          add: {
            content: "export namespace Target {",
          },
        },
        {
          add: {
            placement: "append",
            content: "}",
          },
        },
      ],
      config: sharedPluginConfig,
    },
    // Variant entity types
    "./src/types/variant.ts": {
      documents: ["../../packages/sections/src/variant/**/*.{ts,tsx,jsx,js,gql,graphql}"],
      plugins: [
        "typescript",
        "typescript-operations",
        {
          add: {
            content: "export namespace Variant {",
          },
        },
        {
          add: {
            placement: "append",
            content: "}",
          },
        },
      ],
      config: sharedPluginConfig,
    },
    // Study entity types
    "./src/types/study.ts": {
      documents: [
        "../../packages/sections/src/study/**/*.{ts,tsx,jsx,js,gql,graphql}",
        "!../../packages/sections/src/study/SharedTraitStudies/**",
      ],
      plugins: [
        "typescript",
        "typescript-operations",
        {
          add: {
            content: "export namespace Study {",
          },
        },
        {
          add: {
            placement: "append",
            content: "}",
          },
        },
      ],
      config: sharedPluginConfig,
    },
    // CredibleSet entity types
    "./src/types/credibleSet.ts": {
      documents: ["../../packages/sections/src/credibleSet/**/*.{ts,tsx,jsx,js,gql,graphql}"],
      plugins: [
        "typescript",
        "typescript-operations",
        {
          add: {
            content: "export namespace CredibleSet {",
          },
        },
        {
          add: {
            placement: "append",
            content: "}",
          },
        },
      ],
      config: sharedPluginConfig,
    },
    // Evidence types
    "./src/types/evidence.ts": {
      documents: ["../../packages/sections/src/evidence/**/*.{ts,tsx,jsx,js,gql,graphql}"],
      plugins: [
        "typescript",
        "typescript-operations",
        {
          add: {
            content: "export namespace Evidence {",
          },
        },
        {
          add: {
            placement: "append",
            content: "}",
          },
        },
      ],
      config: sharedPluginConfig,
    },
    // Common/shared types (sections common folder)
    "./src/types/common.ts": {
      documents: ["../../packages/sections/src/common/**/*.{ts,tsx,jsx,js,gql,graphql}"],
      plugins: [
        "typescript",
        "typescript-operations",
        {
          add: {
            content: "export namespace Common {",
          },
        },
        {
          add: {
            placement: "append",
            content: "}",
          },
        },
      ],
      config: sharedPluginConfig,
    },
    // Platform types
    "./src/types/platform.ts": {
      documents: [
        "../../apps/platform/src/**/*.{ts,tsx,jsx,js,gql,graphql}",
        "!../../apps/platform/src/pages/APIPage/**",
        "!../../apps/platform/src/pages/**/Profile.tsx",
      ],
      plugins: [
        "typescript",
        "typescript-operations",
        {
          add: {
            content: "export namespace Platform {",
          },
        },
        {
          add: {
            placement: "append",
            content: "}",
          },
        },
      ],
      config: sharedPluginConfig,
    },
    // UI package types
    "./src/types/ui.ts": {
      documents: ["../../packages/ui/src/**/*.{ts,tsx,jsx,js,gql,graphql}"],
      plugins: [
        "typescript",
        "typescript-operations",
        {
          add: {
            content: "export namespace UI {",
          },
        },
        {
          add: {
            placement: "append",
            content: "}",
          },
        },
      ],
      config: sharedPluginConfig,
    },
    // Schema introspection
    "./graphql.schema.json": {
      documents: [],
      plugins: ["introspection"],
    },
  },
};

export default config;
