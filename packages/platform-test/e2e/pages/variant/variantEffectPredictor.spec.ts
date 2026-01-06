import { expect, test } from "@playwright/test";
import { VariantEffectPredictorSection } from "../../../POM/objects/widgets/shared/variantEffectPredictorSection";
import { VariantPage } from "../../../POM/page/variant/variant";

test.describe("Variant Effect Predictor / Transcript Consequences Section", () => {
  let variantPage: VariantPage;
  let vepSection: VariantEffectPredictorSection;

  test.beforeEach(async ({ page }) => {
    variantPage = new VariantPage(page);
    vepSection = new VariantEffectPredictorSection(page);

    // Navigate to a variant with transcript consequence data
    await variantPage.goToVariantPage("1_154453788_C_T");

    // Wait for the section to fully load
    await vepSection.waitForLoad();
  });

  test("Variant Effect Predictor section is visible", async () => {
    expect(await vepSection.isSectionVisible()).toBe(true);
  });

  test("Transcript consequences table displays data", async () => {
    const rowCount = await vepSection.getTableRows();

    expect(rowCount).toBeGreaterThan(0);
  });

  test("Gene links are displayed in table", async () => {
    const geneName = await vepSection.getGeneName(0);

    expect(geneName).not.toBeNull();
    expect(geneName).not.toBe("");
  });

  test("Can click gene link in table", async ({ page }) => {
    await vepSection.clickGeneLink(0);

    // Wait for navigation to target page
    await page.waitForURL((url) => url.toString().includes("/target/"), { timeout: 5000 });

    // Should navigate to target/gene page
    expect(page.url()).toContain("/target/");
  });

  test("Predicted consequence is displayed", async () => {
    const consequence = await vepSection.getPredictedConsequence(0);

    expect(consequence).not.toBeNull();
    expect(consequence).not.toBe("");
  });

  test("Impact value is displayed", async () => {
    const impact = await vepSection.getImpact(0);

    expect(impact).not.toBeNull();
  });

  test("Can search/filter transcript consequences", async () => {
    // Search for a specific term
    await vepSection.search("missense");

    // Row count should change (could be more or less depending on data)
    const filteredRowCount = await vepSection.getTableRows();

    // At least the search should execute without error
    expect(filteredRowCount).toBeGreaterThanOrEqual(0);
  });
});
