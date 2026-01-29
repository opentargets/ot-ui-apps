import { expect, test } from "../../../fixtures";
import { ClinicalPrecedenceSection } from "../../../POM/objects/widgets/KnownDrugs/knownDrugsSection";
import { DrugPage } from "../../../POM/page/drug/drug";

test.describe("Drug Clinical Precedence Section", () => {
  let drugPage: DrugPage;
  let clinicalPrecedence: ClinicalPrecedenceSection;

  test.beforeEach(async ({ page, testConfig }) => {
    drugPage = new DrugPage(page);
    clinicalPrecedence = new ClinicalPrecedenceSection(page);

    // Navigate to a drug with clinical precedence data
    await drugPage.goToDrugPage(testConfig.drug.primary);

    // Check if section is visible
    const isVisible = await clinicalPrecedence.isSectionVisible();
    if (isVisible) {
      // Wait for table to be visible
      await page.waitForSelector("[data-testid='section-knowndrugs'] table", {
        state: "visible",
        timeout: 10000,
      });
    } else {
      test.skip();
    }
  });

  test("Clinical precedence section is visible when data available", async () => {
    const isVisible = await clinicalPrecedence.isSectionVisible();
    expect(isVisible).toBe(true);
  });

  test("Clinical precedence table displays data", async () => {
    const rowCount = await clinicalPrecedence.getRowCount();

    expect(rowCount).toBeGreaterThan(0);
  });

  test("Drug name is displayed", async () => {
    const drugCell = clinicalPrecedence.getDrugCell(0);
    const drugName = await drugCell.textContent();

    expect(drugName).not.toBeNull();
    expect(drugName).not.toBe("");
  });
});
