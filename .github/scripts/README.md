# Auto-Generated Tests System

This system automatically detects new widgets/sections in PRs and generates Playwright interactors and tests using Claude AI.

## How It Works

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   PR Created    │────▶│  Detect Changes  │────▶│  Generate Tests │
│   or Updated    │     │  (git diff)      │     │  (Claude API)   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                          │
                                                          ▼
                        ┌──────────────────┐     ┌─────────────────┐
                        │  Commit & Push   │◀────│  Write Files    │
                        │  to PR Branch    │     │  to Repo        │
                        └──────────────────┘     └─────────────────┘
```

## Files

| File | Description |
|------|-------------|
| `workflows/generate-tests.yml` | GitHub Action workflow |
| `scripts/detect-new-widgets.js` | Detects new widgets in PR diff |
| `scripts/generate-tests.js` | Calls Claude API to generate code |
| `prompts/interactor-template.md` | Prompt template for interactors |
| `prompts/test-template.md` | Prompt template for tests |

## Setup

### 1. Add Anthropic API Key

Add your Anthropic API key as a GitHub repository secret:

1. Go to your repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `ANTHROPIC_API_KEY`
4. Value: Your Anthropic API key

### 2. Enable Workflow Permissions

Ensure the workflow has write permissions:

1. Go to **Settings** → **Actions** → **General**
2. Under "Workflow permissions", select **Read and write permissions**
3. Check **Allow GitHub Actions to create and approve pull requests**

## Trigger Conditions

The workflow triggers when a PR:
- Is opened or updated (synchronized)
- Contains changes in:
  - `packages/sections/src/**` (widget/section files)
  - `apps/platform/src/pages/**` (page files)

## Generated Output

### Interactor Files
Location: `packages/platform-test/POM/objects/widgets/<WidgetName>/`

```
packages/platform-test/POM/objects/widgets/
├── KnownDrugs/
│   └── knownDrugsSection.ts
├── NewWidget/              ← Generated
│   └── newWidgetSection.ts
```

### Test Files
Location: `packages/platform-test/e2e/pages/<entity>/`

```
packages/platform-test/e2e/pages/
├── disease/
│   ├── disease.spec.ts
│   └── newwidget.spec.ts   ← Generated
├── target/
│   └── newwidget.spec.ts   ← Generated
```

## Local Testing

You can run the detection script locally:

```bash
# Set the base branch
export GITHUB_BASE_REF=main

# Run detection
node .github/scripts/detect-new-widgets.js
```

To run generation locally:

```bash
# Set API key
export ANTHROPIC_API_KEY=your-api-key

# Run detection first
node .github/scripts/detect-new-widgets.js

# Run generation
node .github/scripts/generate-tests.js
```

## Customization

### Changing the LLM Model

Edit `.github/scripts/generate-tests.js`:

```javascript
const MODEL = 'claude-sonnet-4-20250514';  // Change to your preferred Claude model
// Options: claude-sonnet-4-20250514, claude-opus-4-20250514, claude-3-5-sonnet-20241022
```

### Modifying Prompts

Edit the prompt templates in `.github/prompts/`:
- `interactor-template.md` - Controls how interactors are generated
- `test-template.md` - Controls how tests are generated

### Adding Support for New Entity Types

Edit `.github/scripts/detect-new-widgets.js`:

```javascript
const ENTITY_TYPES = ['target', 'disease', 'drug', 'evidence', 'variant', 'study', 'credibleSet'];
// Add new entity types here
```

## Troubleshooting

### Workflow Not Triggering

- Ensure the PR modifies files in the watched paths
- Check that workflow permissions are enabled

### API Errors

- Verify the `ANTHROPIC_API_KEY` secret is set correctly
- Check API rate limits and quotas

### Poor Generation Quality

- Improve the source widget code (add comments, clear structure)
- Adjust the prompt templates with more examples
- Consider using Claude Opus for better quality

### Generated Code Has Issues

The LLM-generated code may need manual adjustments:
- Update selectors if data-testid attributes differ
- Add missing test cases
- Fix import paths if needed

## Cost Considerations

Each widget generation makes 2 API calls:
1. Interactor generation (~1,000-2,000 tokens)
2. Test generation (~1,500-3,000 tokens)

Estimated cost per widget: ~$0.02-0.10 (with Claude Sonnet)

## Contributing

To improve the generation quality:
1. Add more examples to the prompt templates
2. Update the system prompts with better instructions
3. Add validation for generated code
