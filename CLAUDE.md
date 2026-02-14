# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Open Targets Platform - a React SPA for drug discovery research. Monorepo using Yarn workspaces with Turbo build orchestration.

## Commands

```bash
# Development
yarn dev:platform          # Start Platform app dev server

# Building
yarn build:platform        # Build Platform app (outputs to bundle-platform/)

# Linting & Formatting (BiomeJS)
yarn lint                  # Check code
yarn lint:fix              # Fix lint issues
yarn check:fix             # Fix both lint and format issues
yarn format:check          # CI format check
```

## Architecture

### Monorepo Structure
- `apps/platform/` - Main Platform React application
- `packages/ui/` - Shared UI components
- `packages/sections/` - Entity section components
- `packages/ot-config/` - Configuration module
- `packages/ot-constants/` - Constants and GraphQL types
- `packages/ot-utils/` - Utility functions

### Tech Stack
- React 18 + TypeScript + Vite
- Apollo Client for GraphQL data fetching
- Material-UI (MUI) for components
- D3 for data visualization

### Section/Widget Architecture

Entity profile pages (target, disease, drug, evidence) use a sections pattern. Each section lives in `apps/platform/src/sections/<entity>/<sectionId>/`:

```
<sectionId>/
├── index.tsx              # Section definition + exports
├── Summary.tsx            # Table of contents entry (uses fragment)
├── Body.tsx               # Main section content
├── Description.tsx        # Section description text
├── <sectionId>SummaryFragment.gql
└── <sectionId>Query.gql
```

**Key patterns:**
- `index.tsx` exports `definition` object with `id`, `name`, `hasData` function
- Summary components attach GraphQL fragments via `Summary.fragments = {...}`
- Use `usePlatformApi(fragment)` hook to access data from context
- Use `useQuery(QUERY, { variables })` for Body-specific queries
- Wrap in `SummaryItem`/`SectionItem` components for consistent loading/error states

### GraphQL
- Queries in separate `.gql` files (imported via vite-plugin-simple-gql)
- Summary queries are fragments bundled at page level
- Body queries are standalone queries with variables

## Code Style

BiomeJS enforces:
- Double quotes, ES5 trailing commas, semicolons always
- 100 character line width
- Organized imports

Key lint rules enabled:
- `useKeyWithClickEvents` (a11y)
- `useButtonType` (a11y)
- `noAccumulatingSpread` (performance)
- `useExhaustiveDependencies` (React hooks)

## PR Convention

Title format: `[Platform]: Short description`

Scopes: `Platform`, `Genetics`, `PackageName`, `AppConfig`
