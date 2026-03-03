# MCP Widgets Server — Developer Guide

## Overview

Self-contained React widgets served as IIFE bundles and rendered inside sandboxed
iframes by the MCP host. There are two kinds of widget:

- **Sections-based** — reuse the exact `Body` component from `packages/sections/`.
  No custom data fetching or table re-implementation needed.
- **Custom** — built from scratch with their own components and data fetching.
  Used when the platform section doesn't exist or the desired output differs
  significantly from the platform view.

---

## Current Widgets

| Tool name | Type | Source | Input |
|---|---|---|---|
| `get_l2g_widget` | Custom | `widget-src/l2g/` | `studyId` |
| `get_variant_effect_widget` | Sections-based | `variant/VariantEffect` | `variantId` |
| `get_molecular_structure_widget` | Sections-based | `variant/MolecularStructure` | `variantId` |
| `get_gwas_credible_sets_widget` | Sections-based | `study/GWASCredibleSets` | `studyId` |
| `get_shared_trait_studies_widget` | Sections-based | `study/SharedTraitStudies` | `studyId` |
| `get_baseline_expression_widget` | Sections-based | `target/BaselineExpression` | `ensgId` |

---

## Adding a Sections-Based Widget

These widgets delegate entirely to the existing `Body.tsx` from `packages/sections/`.

### 1. Read the section `Body.tsx`

```
packages/sections/src/<entity>/<SectionName>/Body.tsx
```

Note the props it expects. Most use `{ id, entity }`. Some need extra context
(e.g. `SharedTraitStudies` needs `diseaseIds` alongside `studyId`).

### 2. Create `widget-src/<name>/`

**`<Name>Widget.tsx`** — wraps Body directly:
```tsx
import Body from "@ot/sections/<entity>/<SectionName>/Body";

export default function MyWidget({ id }: { id: string }) {
  return <Body id={id} entity="<entity>" />;
}
```

If Body needs extra props not available from the MCP tool input, add a `useQuery`
to fetch them first. See `SharedTraitStudiesWidget.tsx` (fetches `diseaseIds` from
the study) or `BaselineExpressionWidget.tsx` (fetches `approvedSymbol` from the
target) for the pattern.

**`main.tsx`** — entry point:
```tsx
import { mountWidget } from "../shared/createWidgetEntry";
import MyWidget from "./MyWidget";

mountWidget({
  appName: "ot-<name>-widget",
  cacheKey: "ot-xx",           // unique short key per widget
  extractArgs: args => {
    const id = typeof args.id === "string" ? args.id : null;
    if (!id) return null;
    return { id };
  },
  component: MyWidget,
});
```

### 3. Create `vite/widget.config.<name>.ts`

```ts
import { resolve } from "path";
import type { Plugin } from "vite";
import { createWidgetBuildConfig, createPlatformStubsPlugin, ROOT } from "./widget.config.base";

function uiBarrelStub(): Plugin {
  const stubPath = resolve(ROOT, "widget-src/shared/stubs/ui-index.tsx");
  return {
    name: "stub-ui-barrel-<name>",
    resolveId(id: string) {
      if (id === "ui") return stubPath;
    },
  };
}

export default createWidgetBuildConfig({
  entry: resolve(ROOT, "widget-src/<name>/main.tsx"),
  outputName: "<Name>Widget",
  outputFile: "<name>.js",
  plugins: [uiBarrelStub(), createPlatformStubsPlugin()],
});
```

### 4. Create `src/widgets/<name>.ts`

```ts
import { WidgetDef } from "./types.js";

export const myWidget: WidgetDef = {
  toolName: "get_<name>_widget",
  description: "...",
  inputParam: { name: "id", description: "..." },
  uriPrefix: "ui://ot-mcp/<name>",
  bundleFile: "<name>.js",
  title: "<Name> Widget",
  successMessage: "... rendered successfully.",
};
```

### 5. Register in `src/widgets/index.ts`

Add the named export and include in `WIDGET_REGISTRY`.

### 6. Add build script in `package.json`

```json
"build:widget:<name>": "vite build --config vite/widget.config.<name>.ts"
```

Append to `build:widgets` chain.

---

## Adding a Custom Widget

Custom widgets own their data fetching and rendering. Use this approach when:
- The section doesn't exist in `packages/sections/`
- The desired output differs from the platform (different chart, different columns)

The process is the same steps as above, but `<Name>Widget.tsx` is written from
scratch rather than importing from `@ot/sections`. You can still use real platform
components directly via the `@ot/ui` alias (e.g. `OtTable`, `HeatmapTable`,
`ObsPlot`), and you have full access to Apollo/React Router in the runtime.

---

## Architecture

### Runtime (per widget)
```
createWidgetEntry.tsx
  └── ApolloProvider       (@apollo/client → OT GraphQL API)
      └── MemoryRouter     (react-router-dom, no URL navigation)
          └── ThemeProvider (widget theme, mirrors platform)
              └── <WidgetComponent>
                  └── Body from @ot/sections/... (sections-based)
                      or custom component (custom)
```

### Build-time aliases (`vite/widget.config.base.ts`)

| Import | Resolves to |
|---|---|
| `"ui"` | `widget-src/shared/stubs/ui-index.tsx` (via per-widget plugin) |
| `@ot/ui` | `packages/ui/src` |
| `@ot/sections` | `packages/sections/src` |
| `@ot/constants` | `packages/ot-constants/src` |
| `@ot/utils` | `packages/ot-utils/src` |

### `createPlatformStubsPlugin()` — what it stubs and why

| File | Reason |
|---|---|
| `packages/ot-config/src/theme.ts` | Calls `polished.lighten(undefined)` at module-load time when `window.configProfile` is absent in the widget sandbox |
| `packages/ot-config/src/environment.ts` | `getConfig()` reads `window.configProfile.*`; stub returns valid colours + `partnerDataTypes: []` |
| `packages/ui/src/components/DataDownloader.jsx` | Pulls in graphiql (CodeMirror + 29 KB CSS); download button not needed in widgets |
| `packages/ui/src/providers/OTApolloProvider/OTApolloProvider.tsx` | `useBatchQuery` uses its custom `useApolloClient`; stub re-exports the standard `@apollo/client` hook so the widget's `ApolloProvider` satisfies it |

### `widget-src/shared/stubs/ui-index.tsx` — barrel stubs

Replaces the `"ui"` barrel for all section components. Key exports:

| Export | Behaviour in widget |
|---|---|
| `Link` | `<a target="_blank">` → `https://platform.opentargets.org` |
| `SectionItem` | Strips section chrome; proxies `request` loading/error state |
| `OtTable` | Real component — direct path import from `@ot/ui` |
| `useBatchQuery` | Real hook — direct path import from `@ot/ui` |
| `useApolloClient` | Re-exported from `@apollo/client` |
| `DataDownloader` | null |
| `PublicationsDrawer` | Simple `<a>` to the first publication URL |
| `DownloadSvgPlot` | Renders children only, omits download button |
| `Tooltip`, `OtAsyncTooltip` | Render children only |
| `ObsPlot`, `ObsChart`, `ObsTooltip` | Real components (direct path imports) |
| `usePlatformApi` | Returns null (Summary fragments not used in widgets) |

### `widget-src/shared/stubs/ui-ms-index.tsx` — barrel stubs for MolecularStructure

Used instead of `ui-index.tsx` for the `molecular-structure` widget build. Extends the
shared stubs with real viewer components that must be identical instances across all
components in the tree (context sharing):

| Export | Behaviour in widget |
|---|---|
| `ViewerProvider`, `ViewerInteractionProvider` | Real providers from `@ot/ui` |
| `useViewerState`, `useViewerDispatch` | Real hooks from `@ot/ui/providers/ViewerProvider` |
| `useViewerInteractionState`, `useViewerInteractionDispatch` | Real hooks from `@ot/ui/providers/ViewerInteractionProvider` |
| `Viewer` | Real component — direct path import from `@ot/ui` |
| `CompactAlphaFold*` | Real legend components — direct path imports from `@ot/ui` |
| `SectionItem`, `DisplayVariantId`, `usePlatformApi` | Re-exported from `ui-index.tsx` |
| `ViewerTrack` | null (sequence track not needed in widget) |
| `ObsPlot`, `ObsChart` | null (not used by MolecularStructure section) |

### Widget theme (`widget-src/shared/theme.ts`)

Mirrors the platform MUI theme including the custom `boxShadow` extension that
platform components access via `theme.boxShadow.default`.

### `.gql` handling

`gqlPlugin()` in `createWidgetBuildConfig` transforms `.gql` files into proper
`DocumentNode` objects via `@apollo/client`'s `gql` tag. Custom widgets (l2g, ve,
ms) keep their own empty-doc stub (higher plugin priority) since they don't use Apollo.

---

## Commands

```bash
# Build a single widget
yarn build:widget:gwas
yarn build:widget:shared-trait-studies
yarn build:widget:baseline-expression

# Build all widgets
yarn build:widgets

# Run the MCP + widget dev server
yarn dev
```
