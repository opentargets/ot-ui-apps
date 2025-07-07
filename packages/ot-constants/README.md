# OT Constants Package

This package contains constants, types, and utilities used across the Open Targets Platform applications.

## GraphQL Types Generation

This package includes automatically generated TypeScript types from the Open Targets Platform GraphQL API.

### Generating GraphQL Types

To generate the latest GraphQL types from the Open Targets Platform API:

```bash
npm run generate-graphql-types
```

This script will:

1. Test multiple possible GraphQL endpoints to find a working one
2. Fetch the complete GraphQL schema using introspection
3. Generate TypeScript interfaces, enums, and union types
4. Save the generated types to `src/graphql-types.ts`

### Generated Types

The script generates:

- **Interfaces**: TypeScript interfaces for all GraphQL object and input types
- **Enums**: TypeScript enums for GraphQL enum types
- **Union Types**: TypeScript union types for GraphQL union types
- **Scalar Mappings**: Proper TypeScript type mappings for GraphQL scalars

### Usage

The generated types are automatically exported from the main package index and can be imported in other packages:

```typescript
import { Target, Disease, Drug, Variant } from "@ot/constants";
```

### Manual Updates

If you need to update the types manually:

1. Run the generation script
2. Review the generated types in `src/graphql-types.ts`
3. Commit the changes

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
