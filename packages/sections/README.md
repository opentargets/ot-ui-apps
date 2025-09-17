# Sections Package Documentation

## Overview

The sections package provides a standardized way to create profile widgets for different entity types (Drug, Target, Disease, Variant, etc.) in the Open Targets Platform. Each section follows a consistent pattern that ensures maintainability and reusability.

## Widget Structure

Every section widget follows this directory structure:

```
SectionName/
├── index.ts              # Main widget definition and exports
├── Summary.tsx           # Summary component for the profile header
├── Body.tsx              # Main content component
├── Description.tsx       # Description component for the section
├── SectionQuery.gql      # GraphQL query for the section data
└── SectionSummaryFragment.gql  # GraphQL fragment for summary data
```

## Widget Interface

Each widget must implement the `Widget` interface:

```typescript
interface Widget {
  definition: {
    id: string;           // Unique identifier for the section
    name: string;         // Display name for the section
    shortName: string;    // Short name for compact display
    hasData: (data: any) => boolean | undefined;  // Function to check if section has data
    isPrivate?: boolean;  // Optional flag for private sections
  };
  Summary: ComponentType<any>;  // Summary component
  getBodyComponent: () => ComponentType<any>;  // Lazy-loaded body component
}
```

## File Patterns

### 1. index.ts

The main entry point that defines the widget structure:

```typescript
import { lazy } from "react";
import { EntityType } from "@ot/constants";

export const definition = {
  id: "section_id",
  name: "Section Display Name",
  shortName: "SDN",
  hasData: (data: EntityType) => {
    // Check if section has data to display
    return (data.someField?.count || 0) > 0;
  },
};

// Export the Summary component
export { default as Summary } from "./Summary";

// Export lazy-loaded body component
export const getBodyComponent = () => lazy(() => import("./Body"));
```

### 2. Summary.tsx

A lightweight component that displays in the profile header:

```typescript
import { SummaryItem, usePlatformApi } from "ui";
import { definition } from ".";
import SECTION_SUMMARY from "./SectionSummaryFragment.gql";

function Summary() {
  const request = usePlatformApi(SECTION_SUMMARY);

  return <SummaryItem definition={definition} request={request} />;
}

Summary.fragments = {
  SectionSummaryFragment: SECTION_SUMMARY,
};

export default Summary;
```

### 3. Body.tsx

The main content component that displays the full section data using the modern pattern:

```typescript
import { useQuery } from "@apollo/client";
import { SectionItem, OtTable, PublicationsDrawer } from "ui";
import { naLabel } from "@ot/constants";
import { definition } from ".";
import { epmcUrl } from "@ot/utils";

import Description from "./Description";
import SECTION_QUERY from "./SectionQuery.gql";

// Type definitions for the data
interface Target {
  id: string;
  approvedSymbol: string;
  approvedName: string;
}

interface Biosample {
  biosampleId: string;
  biosampleName: string;
  biosampleFromSource?: string;
}

const columns = [
  {
    id: "biosample",
    label: "Cell type",
    renderCell: ({ biosample }: { biosample: Biosample }) => {
      if (!biosample) return naLabel;
      return (
        <Link external to={`http://purl.obolibrary.org/obo/${biosample.biosampleId}`}>
          {biosample.biosampleFromSource || biosample.biosampleId}
        </Link>
      );
    },
    filterValue: ({ biosample }: { biosample: Biosample }) => 
      biosample?.biosampleFromSource || biosample?.biosampleId || "",
  },
  {
    id: "target",
    label: "Gene",
    renderCell: ({ target }: { target: Target }) => {
      if (!target) return naLabel;
      return (
        <Link asyncTooltip to={`/target/${target.id}`}>
          {target.approvedSymbol}
        </Link>
      );
    },
    filterValue: ({ target }: { target: Target }) => target?.approvedSymbol || "",
  },
  // ... more columns
];

type BodyProps = {
  id: string;
  entity: string;
};

function Body({ id, entity }: BodyProps) {
  const variables = {
    variantId: id,
  };

  const request = useQuery(SECTION_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      renderDescription={() => (
        <Description
          variantId={id}
          referenceAllele={request.data?.variant?.referenceAllele || ""}
          alternateAllele={request.data?.variant?.alternateAllele || ""}
        />
      )}
      renderBody={() => (
        <OtTable
          dataDownloader
          dataDownloaderFileStem={`${id}-section-name`}
          showGlobalFilter
          columns={columns}
          loading={request.loading}
          rows={request.data?.variant?.sectionField?.rows || []}
          query={SECTION_QUERY.loc?.source?.body}
          variables={variables}
          tableDataLoading={request.loading}
          order="desc"
          sortBy="score"
          defaultSortObj={{ id: "score", desc: true }}
          showColumnVisibilityControl={true}
          showPagination={true}
          pageSize={10}
        />
      )}
    />
  );
}

export default Body;
```

### 4. Description.tsx

Provides a description of what the section shows:

```typescript
import { Link, DisplayVariantId } from "ui";

type DescriptionProps = {
  variantId: string;
  referenceAllele: string;
  alternateAllele: string;
};

function Description({ variantId, referenceAllele, alternateAllele }: DescriptionProps) {
  return (
    <>
      Description of what this section shows for{" "}
      <strong>
        <DisplayVariantId
          variantId={variantId}
          referenceAllele={referenceAllele}
          alternateAllele={alternateAllele}
        />
      </strong>
      .
    </>
  );
}

export default Description;
```

### 5. GraphQL Files

#### SectionQuery.gql
Main query for fetching section data:

```graphql
query SectionQuery($variantId: String!) {
  variant(variantId: $variantId) {
    id
    rsIds
    sectionField {
      count
      rows {
        # ... section-specific fields
      }
    }
  }
}
```

#### SectionSummaryFragment.gql
Fragment for summary data:

```graphql
fragment SectionSummaryFragment on Variant {
  sectionField {
    count
  }
}
```

## Entity-Specific Patterns

### Variant Sections

Variant sections typically include:
- `referenceAllele` and `alternateAllele` in queries
- Use of `DisplayVariantId` component for variant display
- Clinical significance and allele origin fields
- Type definitions for data structures (Target, Biosample, etc.)
- Proper TypeScript typing for column renderCell functions

### Target Sections

Target sections typically include:
- Gene/protein information
- Expression data
- Pathway and interaction data

### Disease Sections

Disease sections typically include:
- Phenotype information
- Associated genes/targets
- Literature references

## Integration with Profile Pages

To integrate a new section into a profile page:

1. **Add to the widget map** in the profile's `Profile.tsx`:

```typescript
const variantProfileWidgets = new Map<string, Widget>([
  // ... existing widgets
  [Variant.NewSection.definition.id, Variant.NewSection],
]);
```

2. **Export from the entity index** (e.g., `packages/sections/src/variant/index.ts`):

```typescript
export * as NewSection from "./NewSection";
```

3. **Update the main sections index** if needed:

```typescript
// In packages/sections/src/index.tsx
export * as Entity from "./entity";
```

## Best Practices

1. **Naming Convention**: Use PascalCase for section names and camelCase for file names
2. **Data Checking**: Always implement proper `hasData` function to avoid showing empty sections
3. **Lazy Loading**: Use lazy loading for body components to improve performance
4. **Error Handling**: Implement proper loading and error states in body components
5. **Accessibility**: Ensure all components are accessible with proper ARIA labels
6. **Internationalization**: Use translation keys for user-facing text
7. **Testing**: Include unit tests for components and integration tests for GraphQL queries
8. **TypeScript**: Use proper type definitions for data structures and column functions
9. **Modern Pattern**: Use SectionItem with request prop and renderBody/renderDescription functions

## Common UI Components

The sections package uses these common UI components from the `ui` package:

- `SectionItem`: Container for section content with modern request pattern
- `SummaryItem`: Container for summary display
- `OtTable`: Data table component with comprehensive props
- `Link`: Navigation and external links
- `Tooltip`: Information tooltips
- `PublicationsDrawer`: Literature references with proper props (entries, customLabel, symbol, name)

## GraphQL Best Practices

1. **Fragment Reuse**: Create reusable fragments for common fields
2. **Pagination**: Implement cursor-based pagination for large datasets
3. **Caching**: Use Apollo Client's caching effectively
4. **Error Boundaries**: Handle GraphQL errors gracefully
5. **Type Safety**: Use TypeScript with GraphQL code generation

## Example: Intervals Section Implementation

The Intervals section demonstrates the modern implementation pattern:

- **Type Definitions**: Proper TypeScript interfaces for Target, Biosample, etc.
- **Column Configuration**: Typed renderCell functions with proper error handling
- **External Links**: Integration with external resources (ENCODE, OBO, etc.)
- **Publications**: Literature drawer with proper configuration
- **Modern SectionItem**: Using request prop with renderBody/renderDescription pattern

This pattern ensures consistency across all sections while allowing for entity-specific customization. 