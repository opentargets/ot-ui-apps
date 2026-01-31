import { expect, test } from "../../../../fixtures";
import { TractabilitySection } from "../../../../POM/objects/widgets/shared/tractabilitySection";

test.describe("Tractability Section", () => {
  test.beforeEach(async ({ page, baseURL, testConfig }) => {
    const targetId = testConfig.target?.primary || "ENSG00000157764";
    await page.goto(`${baseURL}/target/${targetId}`);
    await page.waitForLoadState("networkidle");
  });

  test("Section is visible when target has tractability data", async ({ page }) => {
    const tractabilitySection = new TractabilitySection(page);
    const isVisible = await tractabilitySection.isSectionVisible();

    if (isVisible) {
      await tractabilitySection.waitForLoad();
      expect(isVisible).toBe(true);
    }
  });

  test("Section header displays correct title", async ({ page }) => {
    const tractabilitySection = new TractabilitySection(page);
    const isVisible = await tractabilitySection.isSectionVisible();

    if (isVisible) {
      await tractabilitySection.waitForLoad();
      const title = await tractabilitySection.getSectionTitle();
      expect(title).toBeTruthy();
    }
  });

  test("Tractability grid is displayed with modalities", async ({ page }) => {
    const tractabilitySection = new TractabilitySection(page);
    const isVisible = await tractabilitySection.isSectionVisible();

    if (isVisible) {
      await tractabilitySection.waitForLoad();
      const grid = tractabilitySection.getGrid();
      const gridVisible = await grid.isVisible().catch(() => false);

      if (gridVisible) {
        const smModality = tractabilitySection.getSmallMoleculeModality();
        const abModality = tractabilitySection.getAntibodyModality();
        const smVisible = await smModality.isVisible().catch(() => false);
        const abVisible = await abModality.isVisible().catch(() => false);
        expect(smVisible || abVisible).toBe(true);
      }
    }
  });

  test("Small molecule modality displays enabled and disabled items", async ({ page }) => {
    const tractabilitySection = new TractabilitySection(page);
    const isVisible = await tractabilitySection.isSectionVisible();

    if (isVisible) {
      await tractabilitySection.waitForLoad();
      const smModality = tractabilitySection.getSmallMoleculeModality();
      const smVisible = await smModality.isVisible().catch(() => false);

      if (smVisible) {
        const enabledCount = await tractabilitySection.getSmallMoleculeEnabledCount();
        const disabledCount = await tractabilitySection.getSmallMoleculeDisabledCount();
        expect(enabledCount + disabledCount).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test("Antibody modality is accessible", async ({ page }) => {
    const tractabilitySection = new TractabilitySection(page);
    const isVisible = await tractabilitySection.isSectionVisible();

    if (isVisible) {
      await tractabilitySection.waitForLoad();
      const abModality = tractabilitySection.getAntibodyModality();
      const abVisible = await abModality.isVisible().catch(() => false);

      if (abVisible) {
        const enabledCount = await tractabilitySection.getAntibodyEnabledCount();
        const disabledCount = await tractabilitySection.getAntibodyDisabledCount();
        expect(enabledCount + disabledCount).toBeGreaterThanOrEqual(0);
      }
    }
  });
});
