# Test Generation Template

You are generating Playwright end-to-end tests for the Open Targets Platform.

## Context

The Open Targets Platform displays scientific data about:
- **Targets**: Genes/proteins (IDs like `ENSG00000158578`)
- **Diseases**: Medical conditions (IDs like `EFO_0000612`)
- **Drugs**: Pharmaceuticals (IDs like `CHEMBL25`)
- **Evidence**: Links between targets and diseases
- **Variants**: Genetic variants
- **Studies**: GWAS studies

Each entity page has a profile view with multiple sections/widgets.

## CRITICAL: Using Fixtures

Tests MUST use the custom fixtures system, NOT direct Playwright imports:

```typescript
// ✅ CORRECT - Import from fixtures
import { expect, test } from "../../../fixtures";

// ❌ WRONG - Do not import from @playwright/test
import { test } from "@playwright/test";
```

The fixtures provide a `testConfig` object with test data:

```typescript
test.beforeEach(async ({ page, testConfig }) => {
  // Use testConfig to get entity IDs
  await drugPage.goToDrugPage(testConfig.drug.primary);
  await variantPage.goToVariantPage(testConfig.variant.withEVA);
  await diseasePage.goToDiseasePage(testConfig.disease.primary);
});
```

## Test File Structure

```typescript
import { expect, test } from "../../../fixtures";
import { [WidgetName]Section } from "../../../POM/objects/widgets/[location]/[widgetName]Section";
import { [Entity]Page } from "../../../POM/page/[entity]/[entity]";

test.describe("[Widget Display Name] Section", () => {
  let [entity]Page: [Entity]Page;
  let [widget]Section: [WidgetName]Section;

  test.beforeEach(async ({ page, testConfig }) => {
    [entity]Page = new [Entity]Page(page);
    [widget]Section = new [WidgetName]Section(page);

    // Navigate using testConfig - use specific config if available
    await [entity]Page.goTo[Entity]Page(testConfig.[entity].with[WidgetName] ?? testConfig.[entity].primary);

    // Check if section is visible, skip if not
    const isVisible = await [widget]Section.isSectionVisible();
    if (isVisible) {
      await [widget]Section.waitForLoad();
    } else {
      test.skip();
    }
  });

  test("Section is visible when data available", async () => {
    const isVisible = await [widget]Section.isSectionVisible();
    expect(isVisible).toBe(true);
  });

  // Add widget-specific tests...
});
```

## Test Categories

### Visibility Tests
- Section container is visible
- Main content area is visible
- Loading states resolve correctly (skip test if no data)

### Content Tests
- Data is displayed (tables have rows, charts render)
- Correct labels/headers are shown
- Links are present and valid

### Interaction Tests
- Search/filter functionality works
- Pagination works
- Sorting works (if applicable)
- Expandable sections expand/collapse
- External links have correct href

### Edge Cases
- Skip test if section is not visible (no data available)

## TestConfig Structure

The `testConfig` fixture provides entity IDs for testing:

```typescript
interface TestConfig {
  drug: {
    primary: string;           // Drug with comprehensive data
    alternatives?: {
      withWarnings: string;
      withAdverseEvents: string;
    };
  };
  variant: {
    primary: string;           // Variant with general data
    withMolecularStructure: string;
    withPharmacogenomics: string;
    withQTL?: string;
    withEVA?: string;
  };
  target?: {
    primary?: string;
    alternatives?: string[];
  };
  disease: {
    primary: string;
    name?: string;
    alternatives?: string[];
  };
  study: {
    gwas: { primary: string; };
    qtl?: { primary?: string; };
  };
}
```

When a widget needs specific data, use the pattern:
- `testConfig.[entity].with[WidgetName]` for widget-specific IDs
- `testConfig.[entity].primary` as fallback

## Best Practices

1. **Always Use Fixtures**: Import from `"../../../fixtures"` not `"@playwright/test"`
2. **Use testConfig**: Get entity IDs from testConfig, never hardcode
3. **Skip Gracefully**: If section isn't visible, skip the test
4. **Test Independence**: Each test should be able to run independently
5. **Descriptive Names**: Test names should describe what is being tested
6. **Proper Waits**: Use `waitForLoad()` before assertions

## Assertions

Use Playwright's `expect` (imported from fixtures) for assertions:

```typescript
// Visibility
expect(await section.isSectionVisible()).toBe(true);
await expect(locator).toBeVisible();

// Text content
await expect(locator).toHaveText("expected text");
await expect(locator).toContainText("partial text");

// Count
const rowCount = await section.getTableRows();
expect(rowCount).toBeGreaterThan(0);

// Attributes
await expect(locator).toHaveAttribute("href", expectedUrl);

// Navigation
await page.waitForURL((url) => url.toString().includes("/disease/"), { timeout: 5000 });
expect(page.url()).toContain("/disease/");
```

## Navigation Patterns

```typescript
// Use Page classes with testConfig
await drugPage.goToDrugPage(testConfig.drug.primary);
await variantPage.goToVariantPage(testConfig.variant.withEVA ?? testConfig.variant.primary);
await diseasePage.goToDiseasePage(testConfig.disease.primary);

// Wait for navigation after click
await page.waitForURL((url) => url.toString().includes("/target/"), { timeout: 5000 });
```

## Important Notes

1. Always import test/expect from "../../../fixtures"
2. Use testConfig fixture for all entity IDs
3. Skip tests gracefully when section has no data
4. Avoid hardcoded timeouts; use proper waits instead
5. Tests should pass on the staging environment
