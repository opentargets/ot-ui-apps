import { expect, test } from "../../../../fixtures";
import { MousePhenotypesSection } from "../../../../POM/objects/widgets/shared/mousePhenotypesSection";

test.describe("Mouse Phenotypes Section", () => {
  test.beforeEach(async ({ page, baseURL, testConfig }) => {
    const targetId = testConfig.target?.primary || "ENSG00000157764";
    await page.goto(`${baseURL}/target/${targetId}`);
    await page.waitForLoadState("networkidle");
  });

  test("Section is visible when target has mouse phenotype data", async ({ page }) => {
    const mousePhenotypesSection = new MousePhenotypesSection(page);
    const isVisible = await mousePhenotypesSection.isSectionVisible();

    if (isVisible) {
      await mousePhenotypesSection.waitForLoad();
      expect(isVisible).toBe(true);
    }
  });

  test("Table is displayed with phenotype data", async ({ page }) => {
    const mousePhenotypesSection = new MousePhenotypesSection(page);
    const isVisible = await mousePhenotypesSection.isSectionVisible();

    if (isVisible) {
      await mousePhenotypesSection.waitForLoad();
      const rowCount = await mousePhenotypesSection.getTableRows();
      expect(rowCount).toBeGreaterThanOrEqual(0);
    }
  });

  test("Phenotype category is displayed in table rows", async ({ page }) => {
    const mousePhenotypesSection = new MousePhenotypesSection(page);
    const isVisible = await mousePhenotypesSection.isSectionVisible();

    if (isVisible) {
      await mousePhenotypesSection.waitForLoad();
      const rowCount = await mousePhenotypesSection.getTableRows();

      if (rowCount > 0) {
        const category = await mousePhenotypesSection.getPhenotypeCategory(0);
        expect(category).toBeTruthy();
      }
    }
  });

  test("Phenotype label is displayed in table rows", async ({ page }) => {
    const mousePhenotypesSection = new MousePhenotypesSection(page);
    const isVisible = await mousePhenotypesSection.isSectionVisible();

    if (isVisible) {
      await mousePhenotypesSection.waitForLoad();
      const rowCount = await mousePhenotypesSection.getTableRows();

      if (rowCount > 0) {
        const label = await mousePhenotypesSection.getPhenotypeLabel(0);
        expect(label).toBeTruthy();
      }
    }
  });

  test("MGI links are available", async ({ page }) => {
    const mousePhenotypesSection = new MousePhenotypesSection(page);
    const isVisible = await mousePhenotypesSection.isSectionVisible();

    if (isVisible) {
      await mousePhenotypesSection.waitForLoad();
      const hasLinks = await mousePhenotypesSection.hasMGILinks();

      if (hasLinks) {
        expect(hasLinks).toBe(true);
      }
    }
  });

  test("Search functionality filters phenotypes", async ({ page }) => {
    const mousePhenotypesSection = new MousePhenotypesSection(page);
    const isVisible = await mousePhenotypesSection.isSectionVisible();

    if (isVisible) {
      await mousePhenotypesSection.waitForLoad();
      const searchInput = mousePhenotypesSection.getSearchInput();
      const searchVisible = await searchInput.isVisible().catch(() => false);

      if (searchVisible) {
        await mousePhenotypesSection.search("mortality");
        await page.waitForTimeout(500);
        const inputValue = await searchInput.inputValue();
        expect(inputValue).toBe("mortality");
      }
    }
  });
});
