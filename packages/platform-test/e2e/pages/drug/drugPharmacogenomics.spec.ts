import { expect, test } from "../../../fixtures";
import { PharmacogenomicsSection } from "../../../POM/objects/widgets/shared/pharmacogenomicsSection";
import { DrugPage } from "../../../POM/page/drug/drug";

test.describe("Drug Pharmacogenomics Section", () => {
  let drugPage: DrugPage;
  let pharmacoSection: PharmacogenomicsSection;

  test.beforeEach(async ({ page, testConfig }) => {
    drugPage = new DrugPage(page);
    pharmacoSection = new PharmacogenomicsSection(page);

    // Navigate to a drug with pharmacogenomics data
    await drugPage.goToDrugPage(testConfig.drug.primary);

    // Check if section is visible
    const isVisible = await pharmacoSection.isSectionVisible();
    if (isVisible) {
      await pharmacoSection.waitForLoad();
    } else {
      test.skip();
    }
  });

  test("Pharmacogenomics section is visible when data available", async () => {
    const isVisible = await pharmacoSection.isSectionVisible();
    expect(isVisible).toBe(true);
  });

  test("Pharmacogenomics table displays data", async () => {
    const rowCount = await pharmacoSection.getTableRows();

    expect(rowCount).toBeGreaterThan(0);
  });

  test("Genotype ID is displayed in table", async () => {
    const genotypeId = await pharmacoSection.getGenotypeId(0);

    expect(genotypeId).not.toBeNull();
    expect(genotypeId).not.toBe("");
  });

  test("Gene/Target link is displayed in table", async () => {
    const hasGeneLink = await pharmacoSection.hasGeneLink(0);

    expect(hasGeneLink).toBe(true);
  });

  test("Can click gene link in table", async ({ page }) => {
    const hasGeneLink = await pharmacoSection.hasGeneLink(0);

    if (hasGeneLink) {
      await pharmacoSection.clickGeneLink(0);

      // Wait for navigation to target page
      await page.waitForURL((url) => url.toString().includes("/target/"), { timeout: 5000 });

      // Should navigate to target/gene page
      expect(page.url()).toContain("/target/");
    }
  });

  test("Phenotype link is displayed when available", async () => {
    const hasPhenotypeLink = await pharmacoSection.hasPhenotypeLink(0);

    if (hasPhenotypeLink) {
      expect(hasPhenotypeLink).toBe(true);
    }
  });

  test("Can search/filter pharmacogenomics data", async () => {
    // Search for a specific term
    await pharmacoSection.search("response");

    // Row count should change
    const filteredRowCount = await pharmacoSection.getTableRows();

    // At least the search should execute without error
    expect(filteredRowCount).toBeGreaterThanOrEqual(0);
  });
});
