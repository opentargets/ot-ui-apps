# VSCode Configuration for Open Targets UI Apps

This directory contains VSCode workspace configuration files to ensure consistent development experience across the team.

## Files

- **`settings.json`**: Workspace settings that configure BiomeJS as the default formatter and linter
- **`extensions.json`**: Recommended extensions for the project
- **`launch.json`**: Debug configurations for the platform app

## Key Features

### BiomeJS Integration
- Uses local BiomeJS installation from `node_modules` (not global)
- Automatic formatting on save for all supported file types
- Automatic import organization on save
- Automatic code fixes on save

### Supported File Types
- JavaScript (`.js`, `.jsx`)
- TypeScript (`.ts`, `.tsx`)
- JSON (`.json`, `.jsonc`)
- GraphQL (`.gql`, `.graphql`)

### Disabled Extensions
- Prettier (conflicts with BiomeJS)
- ESLint (replaced by BiomeJS)

## Setup

1. Install the recommended VSCode extensions when prompted
2. The workspace settings will automatically configure BiomeJS
3. Format on save and other features will work immediately

## Manual Commands

If you need to run BiomeJS manually:

```bash
# Check for issues
npm run check

# Fix issues automatically
npm run check:fix

# Format files
npm run format:fix

# Lint only
npm run lint:fix
```

## Troubleshooting

If formatting doesn't work:
1. Ensure the BiomeJS extension is installed
2. Check that the local BiomeJS installation exists: `ls node_modules/@biomejs/biome`
3. Restart VSCode
4. Check the VSCode output panel for BiomeJS extension logs
