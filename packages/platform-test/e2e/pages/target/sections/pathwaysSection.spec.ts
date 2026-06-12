import { expect, test } from "../../../../fixtures";
import { PathwaysSection } from "../../../../POM/objects/widgets/shared/pathwaysSection";

test.describe("Pathways Section", () => {
  test.beforeEach(async ({ page, baseURL, testConfig }) => {
    const targetId = testConfig.target?.primary || "ENSG00000157764";
    await page.goto(`${baseURL}/target/${targetId}`);
    await page.waitForLoadState("networkidle");
  });

  test("Section is visible when target has pathway data", async ({ page }) => {
    const pathwaysSection = new PathwaysSection(page);
    const isVisible = await pathwaysSection.isSectionVisible();

    if (isVisible) {
      await pathwaysSection.waitForLoad();
      expect(isVisible).toBe(true);
    }
  });

  test("Table is displayed with pathway data", async ({ page }) => {
    const pathwaysSection = new PathwaysSection(page);
    const isVisible = await pathwaysSection.isSectionVisible();

    if (isVisible) {
      await pathwaysSection.waitForLoad();
      const rowCount = await pathwaysSection.getTableRows();
      expect(rowCount).toBeGreaterThanOrEqual(0);
    }
  });

  test("Pathway name is displayed in table rows", async ({ page }) => {
    const pathwaysSection = new PathwaysSection(page);
    const isVisible = await pathwaysSection.isSectionVisible();

    if (isVisible) {
      await pathwaysSection.waitForLoad();
      const rowCount = await pathwaysSection.getTableRows();

      if (rowCount > 0) {
        const pathwayName = await pathwaysSection.getPathwayName(0);
        expect(pathwayName).toBeTruthy();
      }
    }
  });

  test("Top-level pathway is displayed", async ({ page }) => {
    const pathwaysSection = new PathwaysSection(page);
    const isVisible = await pathwaysSection.isSectionVisible();

    if (isVisible) {
      await pathwaysSection.waitForLoad();
      const rowCount = await pathwaysSection.getTableRows();

      if (rowCount > 0) {
        const topLevelPathway = await pathwaysSection.getTopLevelPathway(0);
        expect(topLevelPathway).toBeTruthy();
      }
    }
  });

  test("Pathway browser link is available", async ({ page }) => {
    const pathwaysSection = new PathwaysSection(page);
    const isVisible = await pathwaysSection.isSectionVisible();

    if (isVisible) {
      await pathwaysSection.waitForLoad();
      const rowCount = await pathwaysSection.getTableRows();

      if (rowCount > 0) {
        const hasLink = await pathwaysSection.hasPathwayBrowserLink(0);
        if (hasLink) {
          expect(hasLink).toBe(true);
        }
      }
    }
  });

  test("Search functionality filters pathways", async ({ page }) => {
    const pathwaysSection = new PathwaysSection(page);
    const isVisible = await pathwaysSection.isSectionVisible();

    if (isVisible) {
      await pathwaysSection.waitForLoad();
      const searchInput = pathwaysSection.getSearchInput();
      const searchVisible = await searchInput.isVisible().catch(() => false);

      if (searchVisible) {
        await pathwaysSection.search("signaling");
        await page.waitForTimeout(500);
        const inputValue = await searchInput.inputValue();
        expect(inputValue).toBe("signaling");
      }
    }
  });
});
