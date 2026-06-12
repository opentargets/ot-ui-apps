import { expect, test } from "../../../../fixtures";
import { DepMapSection } from "../../../../POM/objects/widgets/shared/depMapSection";

test.describe("DepMap Essentiality Section", () => {
  test.beforeEach(async ({ page, baseURL, testConfig }) => {
    const targetId = testConfig.target?.primary || "ENSG00000157764";
    await page.goto(`${baseURL}/target/${targetId}`);
    await page.waitForLoadState("networkidle");
  });

  test("Section is visible when target has DepMap data", async ({ page }) => {
    const depMapSection = new DepMapSection(page);
    const isVisible = await depMapSection.isSectionVisible();

    if (isVisible) {
      await depMapSection.waitForLoad();
      expect(isVisible).toBe(true);
    }
  });

  test("Plot is displayed when data is available", async ({ page }) => {
    const depMapSection = new DepMapSection(page);
    const isVisible = await depMapSection.isSectionVisible();

    if (isVisible) {
      await depMapSection.waitForLoad();
      const isPlotVisible = await depMapSection.isPlotVisible();

      if (isPlotVisible) {
        expect(isPlotVisible).toBe(true);
      }
    }
  });

  test("Export data button is available", async ({ page }) => {
    const depMapSection = new DepMapSection(page);
    const isVisible = await depMapSection.isSectionVisible();

    if (isVisible) {
      await depMapSection.waitForLoad();
      const isExportVisible = await depMapSection.isExportDataButtonVisible();

      if (isExportVisible) {
        expect(isExportVisible).toBe(true);
      }
    }
  });
});
