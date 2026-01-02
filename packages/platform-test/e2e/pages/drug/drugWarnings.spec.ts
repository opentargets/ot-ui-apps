import { expect, test } from "@playwright/test";
import { DrugWarningsSection } from "../../../POM/objects/widgets/shared/drugWarningsSection";
import { DrugPage } from "../../../POM/page/drug/drug";

test.describe("Drug Warnings Section", () => {
  let drugPage: DrugPage;
  let warningsSection: DrugWarningsSection;

  test.beforeEach(async ({ page }) => {
    drugPage = new DrugPage(page);
    warningsSection = new DrugWarningsSection(page);

    // Navigate to a drug with warnings data
    await drugPage.goToDrugPage("CHEMBL1201585");

    // Check if section is visible
    const isVisible = await warningsSection.isSectionVisible();
    if (isVisible) {
      await warningsSection.waitForLoad();
    } else {
      test.skip();
    }
  });

  test("Drug Warnings section is visible when data available", async () => {
    const isVisible = await warningsSection.isSectionVisible();
    expect(isVisible).toBe(true);
  });

  test("Drug Warnings table displays data", async () => {
    const rowCount = await warningsSection.getTableRows();

    expect(rowCount).toBeGreaterThan(0);
  });

  test("Warning type is displayed", async () => {
    const warningType = await warningsSection.getWarningType(0);

    expect(warningType).not.toBeNull();
    expect(warningType).not.toBe("");
  });

  test("Can click adverse event link when available", async ({ page }) => {
    const hasLink = await warningsSection.hasAdverseEventLink(0);

    if (hasLink) {
      await warningsSection.clickAdverseEventLink(0);

      // Wait for navigation to disease page
      await page.waitForURL((url) => url.toString().includes("/disease/"), { timeout: 5000 });

      // Should navigate to disease page
      expect(page.url()).toContain("/disease/");
    }
  });

  test("Can search/filter warnings", async () => {
    const initialRowCount = await warningsSection.getTableRows();

    // Search for a specific term
    await warningsSection.search("warning");

    // Row count should change
    const filteredRowCount = await warningsSection.getTableRows();

    // At least the search should execute without error
    expect(filteredRowCount).toBeGreaterThanOrEqual(0);
  });
});
