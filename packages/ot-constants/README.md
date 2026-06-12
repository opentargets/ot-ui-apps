# OT Constants Package

This package contains constants, types, and utilities used across the Open Targets Platform applications.

## GraphQL Types Generation

This package includes automatically generated TypeScript types from the Open Targets Platform GraphQL API using `@graphql-codegen/cli`.

### Prerequisites

Ensure the `VITE_API_URL` environment variable is set in `apps/platform/.env`. The codegen script uses this URL for GraphQL schema introspection.

### Generating GraphQL Types

To generate the latest GraphQL types from the Open Targets Platform API:

```bash
yarn generateAPITypes
```

This command runs `graphql-codegen --config codegen.ts` which will:

1. Load the GraphQL schema from the API URL specified in `VITE_API_URL`
2. Scan GraphQL operations from source files across the monorepo
3. Generate namespaced TypeScript types for each entity
4. Output type files to `src/types/index.ts` file
5. Generate schema introspection to `graphql.schema.json`

### Generated Types


Each file contains:

- **TypeScript interfaces** for GraphQL object and input types
- **Enums** for GraphQL enum types
- **Operation types** for queries, mutations, and their variables

### Usage

Import the types directly from the generated types file:

```typescript
import { Disease } from "@ot/constants/src/types/";



### Manual Updates

If you need to update the types:

1. Ensure `VITE_API_URL` is correctly set in `apps/platform/.env`
2. Run `yarn generateAPITypes`
3. Review the generated types in `src/types/`
4. Commit the changes

## Other Exports

This package also exports:

- Application constants and configuration
- Color schemes and styling constants
- Utility functions for data formatting
- Type definitions for various data structures

## Development

To contribute to this package:

1. Make your changes in the appropriate files
2. Run `npm run lint` to check for issues
3. Test your changes by importing them in other packages
4. Update this README if you add new functionality
