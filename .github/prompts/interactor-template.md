# Interactor Generation Template

You are generating a Page Object Model (POM) interactor class for the Open Targets Platform.

## Context

The Open Targets Platform is a drug discovery tool that displays scientific data about targets, diseases, drugs, and evidence. Each entity page has multiple "sections" or "widgets" that display specific types of data.

## Interactor Structure

Each interactor class should follow this structure:

```typescript
import type { Locator, Page } from "@playwright/test";

export class [WidgetName]Section {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Section container - uses data-testid
  getSection(): Locator {
    return this.page.locator("[data-testid='section-[sectionId]']");
  }

  async isSectionVisible(): Promise<boolean> {
    return await this.getSection().isVisible();
  }

  // Section header
  getSectionHeader(): Locator {
    return this.page.locator("[data-testid='section-[sectionId]-header']");
  }

  async getSectionTitle(): Promise<string | null> {
    return await this.getSectionHeader().textContent();
  }

  // ... widget-specific methods based on the Body component

  // Wait for section to load
  async waitForSectionLoad(): Promise<void> {
    await this.getSection().waitFor({ state: "visible" });
    // Add any additional waits for dynamic content
  }
}
```

## Common Patterns

### For sections with tables:
- `getTable()` - returns table locator
- `getTableRows()` - returns all table body rows
- `getRowCount()` - returns number of rows
- `getCell(rowIndex, columnIndex)` - returns specific cell

### For sections with search/filter:
- `getSearchInput()` - returns search input locator
- `search(term)` - performs search action
- `clearSearch()` - clears search

### For sections with pagination:
- `getNextPageButton()` - returns next page button
- `getPreviousPageButton()` - returns previous page button
- `clickNextPage()` - clicks next page
- `clickPreviousPage()` - clicks previous page
- `getPageInfo()` - returns current page info

### For sections with charts/visualizations:
- `getChart()` - returns chart container
- `isChartVisible()` - checks chart visibility
- `getChartLegend()` - returns legend items

### For sections with external links:
- `getExternalLinks()` - returns all external link locators
- `getExternalLinkByText(text)` - returns specific link

## Naming Conventions

- Class name: PascalCase with "Section" suffix (e.g., `KnownDrugsSection`)
- Methods: camelCase, starting with verb (get, is, has, click, wait, etc.)
- Locator methods: prefix with "get" (e.g., `getTable()`)
- Boolean methods: prefix with "is" or "has" (e.g., `isVisible()`)
- Action methods: use verb (e.g., `clickNextPage()`, `search()`)

## Data Test IDs

Use these patterns for data-testid selectors:
- Section container: `section-[sectionId]`
- Section header: `section-[sectionId]-header`
- Section description: `section-description`
- Tables: standard HTML table selectors within section
- Buttons: descriptive names like `next-page-button`, `export-button`

## Important Notes

1. Always use async/await for Playwright operations
2. Return Locators for element getters (allows chaining and assertions)
3. Return Promises for action methods
4. Include error handling with `.catch()` for optional elements
5. Add appropriate timeouts for dynamic content
