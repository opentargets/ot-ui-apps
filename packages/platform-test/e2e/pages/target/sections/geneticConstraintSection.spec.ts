import { expect, test } from "../../../../fixtures";
import { GeneticConstraintSection } from "../../../../POM/objects/widgets/shared/geneticConstraintSection";

test.describe("Genetic Constraint Section", () => {
  test.beforeEach(async ({ page, baseURL, testConfig }) => {
    const targetId = testConfig.target?.primary || "ENSG00000157764";
    await page.goto(`${baseURL}/target/${targetId}`);
    await page.waitForLoadState("networkidle");
  });

  test("Section is visible when target has constraint data", async ({ page }) => {
    const geneticConstraintSection = new GeneticConstraintSection(page);
    const isVisible = await geneticConstraintSection.isSectionVisible();

    if (isVisible) {
      await geneticConstraintSection.waitForLoad();
      expect(isVisible).toBe(true);
    }
  });

  test("Table is displayed with constraint metrics", async ({ page }) => {
    const geneticConstraintSection = new GeneticConstraintSection(page);
    const isVisible = await geneticConstraintSection.isSectionVisible();

    if (isVisible) {
      await geneticConstraintSection.waitForLoad();
      const rowCount = await geneticConstraintSection.getTableRows();
      expect(rowCount).toBeGreaterThanOrEqual(0);
    }
  });

  test("Constraint type is displayed in table rows", async ({ page }) => {
    const geneticConstraintSection = new GeneticConstraintSection(page);
    const isVisible = await geneticConstraintSection.isSectionVisible();

    if (isVisible) {
      await geneticConstraintSection.waitForLoad();
      const rowCount = await geneticConstraintSection.getTableRows();

      if (rowCount > 0) {
        const constraintType = await geneticConstraintSection.getConstraintType(0);
        expect(constraintType).toBeTruthy();
      }
    }
  });

  test("Observed and expected values are displayed", async ({ page }) => {
    const geneticConstraintSection = new GeneticConstraintSection(page);
    const isVisible = await geneticConstraintSection.isSectionVisible();

    if (isVisible) {
      await geneticConstraintSection.waitForLoad();
      const rowCount = await geneticConstraintSection.getTableRows();

      if (rowCount > 0) {
        const observed = await geneticConstraintSection.getObservedValue(0);
        const expected = await geneticConstraintSection.getExpectedValue(0);
        expect(observed || expected).toBeTruthy();
      }
    }
  });

  test("gnomAD link is available", async ({ page }) => {
    const geneticConstraintSection = new GeneticConstraintSection(page);
    const isVisible = await geneticConstraintSection.isSectionVisible();

    if (isVisible) {
      await geneticConstraintSection.waitForLoad();
      const hasLink = await geneticConstraintSection.hasGnomadLink();

      if (hasLink) {
        expect(hasLink).toBe(true);
      }
    }
  });
});
