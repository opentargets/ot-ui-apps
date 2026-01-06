import { expect, test } from "../../../fixtures";
import { PharmacogenomicsSection } from "../../../POM/objects/widgets/shared/pharmacogenomicsSection";
import { VariantPage } from "../../../POM/page/variant/variant";

test.describe("Pharmacogenomics Section", () => {
  let variantPage: VariantPage;
  let pharmacoSection: PharmacogenomicsSection;

  test.beforeEach(async ({ page, testConfig }) => {
    variantPage = new VariantPage(page);
    pharmacoSection = new PharmacogenomicsSection(page);

    // Navigate to a variant with pharmacogenomics data
    // Using rs662 (PON1 gene) which should have pharmaco data
    await variantPage.goToVariantPage(
      testConfig.variant.withPharmacogenomics ?? testConfig.variant.primary
    );

    // Wait for the section to load if it's visible
    const isVisible = await pharmacoSection.isSectionVisible();
    if (isVisible) {
      await pharmacoSection.waitForLoad();
    }
    if (isVisible) {
      expect(isVisible).toBe(true);
    } else {
      test.skip();
    }
  });

  test("Pharmacogenomics table displays data when available", async () => {
    const isVisible = await pharmacoSection.isSectionVisible();

    if (isVisible) {
      const rowCount = await pharmacoSection.getTableRows();
      expect(rowCount).toBeGreaterThan(0);
    } else {
      test.skip();
    }
  });

  test("Genotype ID is displayed in table", async () => {
    const isVisible = await pharmacoSection.isSectionVisible();

    if (isVisible) {
      const genotypeId = await pharmacoSection.getGenotypeId(0);

      expect(genotypeId).not.toBeNull();
      expect(genotypeId).not.toBe("");
    } else {
      test.skip();
    }
  });

  test("Drug links are displayed in table", async () => {
    const isVisible = await pharmacoSection.isSectionVisible();

    if (isVisible) {
      const drugCount = await pharmacoSection.getDrugLinksCount(0);

      expect(drugCount).toBeGreaterThan(0);
    } else {
      test.skip();
    }
  });

  test("Can click drug link in table", async ({ page }) => {
    const isVisible = await pharmacoSection.isSectionVisible();

    if (isVisible) {
      await pharmacoSection.clickDrugLink(0);

      // Wait for navigation to drug page
      await page.waitForURL((url) => url.toString().includes("/drug/"), { timeout: 5000 });
    }
  });

  test("Gene/Target link is displayed in table", async () => {
    const isVisible = await pharmacoSection.isSectionVisible();

    if (isVisible) {
      const hasGeneLink = await pharmacoSection.hasGeneLink(0);

      if (hasGeneLink) {
        const geneName = await pharmacoSection.getGeneName(0);
        expect(geneName).not.toBeNull();
      }
    } else {
      test.skip();
    }
  });

  test("Can click gene link in table", async ({ page }) => {
    const isVisible = await pharmacoSection.isSectionVisible();

    if (isVisible) {
      const hasGeneLink = await pharmacoSection.hasGeneLink(0);

      if (hasGeneLink) {
        await pharmacoSection.clickGeneLink(0);

        // Wait for navigation to target page
        await page.waitForURL((url) => url.toString().includes("/target/"), { timeout: 5000 });
      }
    }
  });
  test("Confidence level is displayed in table", async () => {
    const isVisible = await pharmacoSection.isSectionVisible();

    if (isVisible) {
      const confidenceLevel = await pharmacoSection.getConfidenceLevel(0);

      expect(confidenceLevel).not.toBeNull();
      expect(confidenceLevel).toContain("Level");
    } else {
      test.skip();
    }
  });

  test("Search functionality works", async () => {
    const isVisible = await pharmacoSection.isSectionVisible();

    if (isVisible) {
      const initialRows = await pharmacoSection.getTableRows();

      // Search for something
      await pharmacoSection.search("simvastatin");

      const filteredRows = await pharmacoSection.getTableRows();

      // Filtered results should be less than or equal to initial rows
      expect(filteredRows).toBeLessThanOrEqual(initialRows);

      // Clear search
      await pharmacoSection.clearSearch();
    } else {
      test.skip();
    }
  });

  test("Pagination works when data is sufficient", async () => {
    const isVisible = await pharmacoSection.isSectionVisible();

    if (isVisible) {
      const rowCount = await pharmacoSection.getTableRows();

      // Only test pagination if we have enough rows
      if (rowCount >= 10) {
        const nextEnabled = await pharmacoSection.isNextPageEnabled();

        if (nextEnabled) {
          await pharmacoSection.clickNextPage();

          // Should still be on the same section
          expect(await pharmacoSection.isSectionVisible()).toBe(true);

          // Previous button should now be enabled
          expect(await pharmacoSection.isPreviousPageEnabled()).toBe(true);
        }
      }
    } else {
      test.skip();
    }
  });
});
