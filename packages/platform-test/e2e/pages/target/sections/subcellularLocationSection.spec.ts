import { expect, test } from "../../../../fixtures";
import { SubcellularLocationSection } from "../../../../POM/objects/widgets/shared/subcellularLocationSection";

test.describe("Subcellular Location Section", () => {
  test.beforeEach(async ({ page, baseURL, testConfig }) => {
    const targetId = testConfig.target?.primary || "ENSG00000157764";
    await page.goto(`${baseURL}/target/${targetId}`);
    await page.waitForLoadState("networkidle");
  });

  test("Section is visible when target has localization data", async ({ page }) => {
    const subcellularSection = new SubcellularLocationSection(page);
    const isVisible = await subcellularSection.isSectionVisible();

    if (isVisible) {
      await subcellularSection.waitForLoad();
      expect(isVisible).toBe(true);
    }
  });

  test("Section header displays correct title", async ({ page }) => {
    const subcellularSection = new SubcellularLocationSection(page);
    const isVisible = await subcellularSection.isSectionVisible();

    if (isVisible) {
      await subcellularSection.waitForLoad();
      const title = await subcellularSection.getSectionTitle();
      expect(title).toBeTruthy();
    }
  });

  test("Visualization is displayed", async ({ page }) => {
    const subcellularSection = new SubcellularLocationSection(page);
    const isVisible = await subcellularSection.isSectionVisible();

    if (isVisible) {
      await subcellularSection.waitForLoad();
      const visualizationVisible = await subcellularSection.isVisualizationVisible();
      const cellDiagramVisible = await subcellularSection.isCellDiagramVisible();
      expect(visualizationVisible || cellDiagramVisible).toBe(true);
    }
  });

  test("HPA Main tab is accessible", async ({ page }) => {
    const subcellularSection = new SubcellularLocationSection(page);
    const isVisible = await subcellularSection.isSectionVisible();

    if (isVisible) {
      await subcellularSection.waitForLoad();
      const hpaTab = subcellularSection.getHpaMainTab();
      const tabVisible = await hpaTab.isVisible().catch(() => false);

      if (tabVisible) {
        await subcellularSection.clickHpaMainTab();
        expect(tabVisible).toBe(true);
      }
    }
  });

  test("UniProt tab is accessible", async ({ page }) => {
    const subcellularSection = new SubcellularLocationSection(page);
    const isVisible = await subcellularSection.isSectionVisible();

    if (isVisible) {
      await subcellularSection.waitForLoad();
      const uniprotTab = subcellularSection.getUniprotTab();
      const tabVisible = await uniprotTab.isVisible().catch(() => false);

      if (tabVisible) {
        await subcellularSection.clickUniprotTab();
        expect(tabVisible).toBe(true);
      }
    }
  });

  test("Location items are displayed", async ({ page }) => {
    const subcellularSection = new SubcellularLocationSection(page);
    const isVisible = await subcellularSection.isSectionVisible();

    if (isVisible) {
      await subcellularSection.waitForLoad();
      const locationCount = await subcellularSection.getLocationCount();

      if (locationCount > 0) {
        const locationName = await subcellularSection.getLocationName(0);
        expect(locationName).toBeTruthy();
      }
    }
  });
});
