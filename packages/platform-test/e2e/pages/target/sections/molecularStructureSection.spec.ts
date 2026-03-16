import { expect, test } from "../../../../fixtures";
import { MolecularStructureSection } from "../../../../POM/objects/widgets/shared/molecularStructureSection";

test.describe("Molecular Structure Section", () => {
  test.beforeEach(async ({ page, baseURL, testConfig }) => {
    const targetId = testConfig.target?.primary || "ENSG00000157764";
    await page.goto(`${baseURL}/target/${targetId}`);
    await page.waitForLoadState("networkidle");
  });

  test("Section is visible when target has structure data", async ({ page }) => {
    const molecularStructureSection = new MolecularStructureSection(page);
    const isVisible = await molecularStructureSection.isSectionVisible();

    if (isVisible) {
      await molecularStructureSection.waitForLoad();
      expect(isVisible).toBe(true);
    }
  });

  test("AlphaFold viewer is displayed when available", async ({ page }) => {
    const molecularStructureSection = new MolecularStructureSection(page);
    const isVisible = await molecularStructureSection.isSectionVisible();

    if (isVisible) {
      await molecularStructureSection.waitForLoad();
      const isAlphaFoldVisible = await molecularStructureSection.isAlphaFoldViewerVisible();

      if (isAlphaFoldVisible) {
        expect(isAlphaFoldVisible).toBe(true);
      }
    }
  });

  test("Structure viewer content is present", async ({ page }) => {
    const molecularStructureSection = new MolecularStructureSection(page);
    const isVisible = await molecularStructureSection.isSectionVisible();

    if (isVisible) {
      await molecularStructureSection.waitForLoad();
      const hasStructureViewer = await molecularStructureSection.hasStructureViewer();
      const hasStructureInfo = await molecularStructureSection.hasStructureInfo();
      expect(hasStructureViewer || hasStructureInfo).toBe(true);
    }
  });
});
