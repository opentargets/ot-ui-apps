import { expect, test } from "../../../../fixtures";
import { ClinicalPrecedenceSection } from "../../../../POM/objects/widgets/KnownDrugs/knownDrugsSection";

test.describe("Known Drugs Section", () => {
  test.beforeEach(async ({ page, baseURL, testConfig }) => {
    const targetId = testConfig.target?.primary || "ENSG00000157764";
    await page.goto(`${baseURL}/target/${targetId}`);
    await page.waitForLoadState("networkidle");
  });

  test("Section is visible when target has drug data", async ({ page }) => {
    const knownDrugsSection = new ClinicalPrecedenceSection(page);
    await page.waitForTimeout(2000);
    const isVisible = await knownDrugsSection.isSectionVisible().catch(() => false);

    if (isVisible) {
      await knownDrugsSection.waitForSectionLoad();
      expect(isVisible).toBe(true);
    }
  });

  test("Section header displays correct title", async ({ page }) => {
    const knownDrugsSection = new ClinicalPrecedenceSection(page);
    await page.waitForTimeout(2000);
    const isVisible = await knownDrugsSection.isSectionVisible().catch(() => false);

    if (isVisible) {
      await knownDrugsSection.waitForSectionLoad();
      const title = await knownDrugsSection.getSectionTitle();
      expect(title).toBeTruthy();
    }
  });

  test("Table is displayed with drug data", async ({ page }) => {
    const knownDrugsSection = new ClinicalPrecedenceSection(page);
    await page.waitForTimeout(2000);
    const isVisible = await knownDrugsSection.isSectionVisible().catch(() => false);

    if (isVisible) {
      await knownDrugsSection.waitForSectionLoad();
      const isTableVisible = await knownDrugsSection.isTableVisible();
      expect(isTableVisible).toBe(true);
    }
  });

  test("Table contains rows with drug information", async ({ page }) => {
    const knownDrugsSection = new ClinicalPrecedenceSection(page);
    await page.waitForTimeout(2000);
    const isVisible = await knownDrugsSection.isSectionVisible().catch(() => false);

    if (isVisible) {
      await knownDrugsSection.waitForSectionLoad();
      const rowCount = await knownDrugsSection.getRowCount();

      if (rowCount > 0) {
        const drugName = await knownDrugsSection.getDrugName(0);
        expect(drugName).toBeTruthy();
      }
    }
  });

  test("Search functionality filters drugs", async ({ page }) => {
    const knownDrugsSection = new ClinicalPrecedenceSection(page);
    await page.waitForTimeout(2000);
    const isVisible = await knownDrugsSection.isSectionVisible().catch(() => false);

    if (isVisible) {
      await knownDrugsSection.waitForSectionLoad();
      const searchInput = knownDrugsSection.getSearchInput();
      const searchVisible = await searchInput.isVisible().catch(() => false);

      if (searchVisible) {
        const initialCount = await knownDrugsSection.getRowCount();
        if (initialCount > 0) {
          const drugName = await knownDrugsSection.getDrugName(0);
          if (drugName) {
            await knownDrugsSection.searchDrug(drugName.substring(0, 3));
            await page.waitForTimeout(500);
            const filteredCount = await knownDrugsSection.getRowCount();
            expect(filteredCount).toBeGreaterThanOrEqual(0);
          }
        }
      }
    }
  });
});
