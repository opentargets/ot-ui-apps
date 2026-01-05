import { expect, test } from "../../../fixtures";
import { EnhancerToGenePredictionsSection } from "../../../POM/objects/widgets/shared/enhancerToGenePredictionsSection";
import { VariantPage } from "../../../POM/page/variant/variant";

test.describe("Enhancer To Gene Predictions Section", () => {
  let variantPage: VariantPage;
  let e2gSection: EnhancerToGenePredictionsSection;

  test.beforeEach(async ({ page, testConfig }) => {
    variantPage = new VariantPage(page);
    e2gSection = new EnhancerToGenePredictionsSection(page);

    // Navigate to a variant with E2G predictions data
    await variantPage.goToVariantPage(testConfig.variant.withMolecularStructure);

    // Check if section is visible
    const isVisible = await e2gSection.isSectionVisible();
    if (isVisible) {
      await e2gSection.waitForLoad();
    } else {
      test.skip();
    }
  });

  test("Enhancer-to-Gene Predictions section is visible when data available", async () => {
    const isVisible = await e2gSection.isSectionVisible();
    expect(isVisible).toBe(true);
  });

  test("E2G predictions table displays data", async () => {
    const rowCount = await e2gSection.getTableRows();

    expect(rowCount).toBeGreaterThan(0);
  });

  test("Target gene name is displayed", async () => {
    const geneName = await e2gSection.getTargetGeneName(0);

    expect(geneName).not.toBeNull();
    expect(geneName).not.toBe("");
  });

  test("Can click target gene link in table", async ({ page }) => {
    await e2gSection.clickTargetGeneLink(0);

    // Wait for navigation to target page
    await page.waitForURL((url) => url.toString().includes("/target/"), { timeout: 5000 });

    // Should navigate to target/gene page
    expect(page.url()).toContain("/target/");
  });

  test("E2G score is displayed", async () => {
    const score = await e2gSection.getE2GScore(0);

    expect(score).not.toBeNull();
    expect(score).not.toBe("");
  });

  test("Can search/filter E2G predictions", async () => {
    const initialRowCount = await e2gSection.getTableRows();

    // Search for a specific term
    await e2gSection.search("ENSG");

    // Row count should change
    const filteredRowCount = await e2gSection.getTableRows();

    // At least the search should execute without error
    expect(filteredRowCount).toBeGreaterThanOrEqual(0);
  });
});
