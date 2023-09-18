import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'https://api.genetics.opentargets.org/graphql',
  documents: [
    'src/**/*.tsx',
    'src/**/*.ts',
    'src/**/*.graphql',
    'src/**/*.gql',
  ],
  generates: {
    './src/__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
      config: {
        scalars: {
          Long: 'number',
        },
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
