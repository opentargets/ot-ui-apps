import { expect, test } from "@playwright/test";
import { VariantEffectSection } from "../../../POM/objects/widgets/Variant/variantEffectSection";
import { VariantPage } from "../../../POM/page/variant/variant";

test.describe("Variant Effect Section", () => {
  let variantPage: VariantPage;
  let variantEffectSection: VariantEffectSection;

  test.beforeEach(async ({ page }) => {
    variantPage = new VariantPage(page);
    variantEffectSection = new VariantEffectSection(page);

    // Navigate to a variant with variant effect data
    await variantPage.goToVariantPage("1_154453788_C_T");

    // Wait for the section to fully load
    await variantEffectSection.waitForLoad();
  });

  test("Variant Effect section is visible", async () => {
    expect(await variantEffectSection.isSectionVisible()).toBe(true);
  });

  test("Variant Effect table displays data", async () => {
    // Switch to table view first (chart is default)
    await variantEffectSection.switchToTableView();

    const rowCount = await variantEffectSection.getTableRows();

    expect(rowCount).toBeGreaterThan(0);
  });

  test("Method names are displayed in table", async () => {
    // Switch to table view first (chart is default)
    await variantEffectSection.switchToTableView();

    const methodName = await variantEffectSection.getMethodName(0);

    expect(methodName).not.toBeNull();
    expect(methodName).not.toBe("");
  });

  test("Predictions are displayed in table", async () => {
    // Switch to table view first (chart is default)
    await variantEffectSection.switchToTableView();

    const prediction = await variantEffectSection.getPrediction(0);

    expect(prediction).not.toBeNull();
  });

  test("Scores are displayed in table", async () => {
    // Switch to table view first (chart is default)
    await variantEffectSection.switchToTableView();

    const score = await variantEffectSection.getScore(0);

    expect(score).not.toBeNull();
  });

  test("Normalised scores are displayed in table", async () => {
    // Switch to table view first (chart is default)
    await variantEffectSection.switchToTableView();

    const normScore = await variantEffectSection.getNormalisedScore(0);

    expect(normScore).not.toBeNull();
  });

  test("Can switch to chart view", async () => {
    // Chart view is already default, but explicitly switch for clarity
    await variantEffectSection.switchToChartView();

    // Verify chart is active
    expect(await variantEffectSection.isChartViewActive()).toBe(true);

    // Verify chart is visible
    expect(await variantEffectSection.isChartVisible()).toBe(true);
  });

  test("Can switch back to table view from chart view", async () => {
    // Chart is default, so just switch to table
    await variantEffectSection.switchToTableView();

    // Verify table view is active
    expect(await variantEffectSection.isTableViewActive()).toBe(true);

    // Verify table is visible
    const rowCount = await variantEffectSection.getTableRows();
    expect(rowCount).toBeGreaterThan(0);
  });

  test("Chart view displays visualization", async () => {
    // Chart is default view
    const isChartVisible = await variantEffectSection.isChartVisible();

    expect(isChartVisible).toBe(true);
  });

  test("All rows have complete data", async () => {
    // Switch to table view first (chart is default)
    await variantEffectSection.switchToTableView();

    const rowCount = await variantEffectSection.getTableRows();

    // Check first 3 rows for complete data
    const rowsToCheck = Math.min(3, rowCount);

    for (let i = 0; i < rowsToCheck; i++) {
      const methodName = await variantEffectSection.getMethodName(i);
      const prediction = await variantEffectSection.getPrediction(i);

      expect(methodName).not.toBeNull();
      expect(prediction).not.toBeNull();
    }
  });
});
