import { resolve } from "node:path";
import type { CodegenConfig } from "@graphql-codegen/cli";
import { config as dotenvConfig } from "dotenv";

// Load .env from apps/platform directory
dotenvConfig({ path: resolve(__dirname, "../../apps/platform/.env") });

const { VITE_API_URL } = process.env;

if (!VITE_API_URL) {
  throw new Error("VITE_API_URL environment variable is not set in .env file");
}

const config: CodegenConfig = {
  overwrite: true,
  schema: `${VITE_API_URL}`,
  errorsOnly: false,
  generates: {
    "./src/types/index.ts": {
      plugins: ["typescript", "typescript-operations", "typescript-graphql-request"],
      config: { gqlTagName: "gql", rawRequest: false },
    },
  },
};

export default config;
