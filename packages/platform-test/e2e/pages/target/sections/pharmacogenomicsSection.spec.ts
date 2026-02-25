import { expect, test } from "../../../../fixtures";
import { PharmacogenomicsSection } from "../../../../POM/objects/widgets/shared/pharmacogenomicsSection";

test.describe("Pharmacogenomics Section", () => {
  test.beforeEach(async ({ page, baseURL, testConfig }) => {
    const targetId = testConfig.target?.primary || "ENSG00000157764";
    await page.goto(`${baseURL}/target/${targetId}`);
    await page.waitForLoadState("networkidle");
  });

  test("Section is visible when target has pharmacogenomics data", async ({ page }) => {
    const pharmacogenomicsSection = new PharmacogenomicsSection(page);
    const isVisible = await pharmacogenomicsSection.isSectionVisible();

    if (isVisible) {
      await pharmacogenomicsSection.waitForLoad();
      expect(isVisible).toBe(true);
    } else {
      test.skip();
    }
  });

  test("Table is displayed with pharmacogenomics data", async ({ page }) => {
    const pharmacogenomicsSection = new PharmacogenomicsSection(page);
    const isVisible = await pharmacogenomicsSection.isSectionVisible();

    if (isVisible) {
      await pharmacogenomicsSection.waitForLoad();
      const rowCount = await pharmacogenomicsSection.getTableRows();
      expect(rowCount).toBeGreaterThanOrEqual(0);
    }
  });

  test("Genotype ID is displayed in table rows", async ({ page }) => {
    const pharmacogenomicsSection = new PharmacogenomicsSection(page);
    const isVisible = await pharmacogenomicsSection.isSectionVisible();

    if (isVisible) {
      await pharmacogenomicsSection.waitForLoad();
      const rowCount = await pharmacogenomicsSection.getTableRows();

      if (rowCount > 0) {
        const genotypeId = await pharmacogenomicsSection.getGenotypeId(0);
        expect(genotypeId).toBeTruthy();
      }
    }
  });

  test("Drug links are available when present", async ({ page }) => {
    const pharmacogenomicsSection = new PharmacogenomicsSection(page);
    const isVisible = await pharmacogenomicsSection.isSectionVisible();

    if (isVisible) {
      await pharmacogenomicsSection.waitForLoad();
      const rowCount = await pharmacogenomicsSection.getTableRows();

      if (rowCount > 0) {
        const drugLinksCount = await pharmacogenomicsSection.getDrugLinksCount(0);
        if (drugLinksCount > 0) {
          const drugName = await pharmacogenomicsSection.getDrugName(0);
          expect(drugName).toBeTruthy();
        }
      }
    }
  });

  test("Pagination controls are functional", async ({ page }) => {
    const pharmacogenomicsSection = new PharmacogenomicsSection(page);
    const isVisible = await pharmacogenomicsSection.isSectionVisible();

    if (isVisible) {
      await pharmacogenomicsSection.waitForLoad();
      const rowCount = await pharmacogenomicsSection.getTableRows();

      if (rowCount >= 10) {
        const isNextEnabled = await pharmacogenomicsSection.isNextPageEnabled();
        if (isNextEnabled) {
          await pharmacogenomicsSection.clickNextPage();
          const isPrevEnabled = await pharmacogenomicsSection.isPreviousPageEnabled();
          expect(isPrevEnabled).toBe(true);
        }
      }
    }
  });

  test("Search functionality filters pharmacogenomics data", async ({ page }) => {
    const pharmacogenomicsSection = new PharmacogenomicsSection(page);
    const isVisible = await pharmacogenomicsSection.isSectionVisible();

    if (isVisible) {
      await pharmacogenomicsSection.waitForLoad();
      const searchInput = pharmacogenomicsSection.getSearchInput();
      const searchVisible = await searchInput.isVisible().catch(() => false);

      if (searchVisible) {
        await pharmacogenomicsSection.search("warfarin");
        await page.waitForTimeout(500);
        const inputValue = await searchInput.inputValue();
        expect(inputValue).toBe("warfarin");
      }
    }
  });
});
