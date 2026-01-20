// This file has been automatically migrated to valid ESM format by Storybook.
import { createRequire } from "node:module";
import type { StorybookConfig } from "@storybook/react-vite";
import { dirname, join } from "path";
import { mergeConfig } from "vite";

const require = createRequire(import.meta.url);
const gql = require("vite-plugin-simple-gql").default;

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
const config: StorybookConfig = {
  stories: [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/sections/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],

  addons: [],

  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },

  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [gql()],
      esbuild: {
        jsxInject: `import React from 'react'`,
      },
    });
  },
};
export default config;
