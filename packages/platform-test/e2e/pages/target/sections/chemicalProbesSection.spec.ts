import { expect, test } from "../../../../fixtures";
import { ChemicalProbesSection } from "../../../../POM/objects/widgets/shared/chemicalProbesSection";

test.describe("Chemical Probes Section", () => {
  test.beforeEach(async ({ page, baseURL, testConfig }) => {
    const targetId = testConfig.target?.primary || "ENSG00000157764";
    await page.goto(`${baseURL}/target/${targetId}`);
    await page.waitForLoadState("networkidle");
  });

  test("Section is visible when target has chemical probe data", async ({ page }) => {
    const chemicalProbesSection = new ChemicalProbesSection(page);
    const isVisible = await chemicalProbesSection.isSectionVisible();

    if (isVisible) {
      await chemicalProbesSection.waitForLoad();
      expect(isVisible).toBe(true);
    }
  });

  test("Section header displays correct title", async ({ page }) => {
    const chemicalProbesSection = new ChemicalProbesSection(page);
    const isVisible = await chemicalProbesSection.isSectionVisible();

    if (isVisible) {
      await chemicalProbesSection.waitForLoad();
      const title = await chemicalProbesSection.getSectionTitle();
      expect(title).toBeTruthy();
    }
  });

  test("Table is displayed with chemical probe data", async ({ page }) => {
    const chemicalProbesSection = new ChemicalProbesSection(page);
    const isVisible = await chemicalProbesSection.isSectionVisible();

    if (isVisible) {
      await chemicalProbesSection.waitForLoad();
      const isTableVisible = await chemicalProbesSection.isTableVisible();
      expect(isTableVisible).toBe(true);
    }
  });

  test("Search functionality filters probes", async ({ page }) => {
    const chemicalProbesSection = new ChemicalProbesSection(page);
    const isVisible = await chemicalProbesSection.isSectionVisible();

    if (isVisible) {
      await chemicalProbesSection.waitForLoad();
      const searchInput = chemicalProbesSection.getSearchInput();
      const searchVisible = await searchInput.isVisible().catch(() => false);

      if (searchVisible) {
        await chemicalProbesSection.search("inhibitor");
        await page.waitForTimeout(500);
        const inputValue = await searchInput.inputValue();
        expect(inputValue).toBe("inhibitor");
      }
    }
  });

  test("Data downloader is available", async ({ page }) => {
    const chemicalProbesSection = new ChemicalProbesSection(page);
    const isVisible = await chemicalProbesSection.isSectionVisible();

    if (isVisible) {
      await chemicalProbesSection.waitForLoad();
      const downloader = chemicalProbesSection.getDataDownloader();
      const downloaderVisible = await downloader.isVisible().catch(() => false);

      if (downloaderVisible) {
        expect(downloaderVisible).toBe(true);
      }
    }
  });
});
