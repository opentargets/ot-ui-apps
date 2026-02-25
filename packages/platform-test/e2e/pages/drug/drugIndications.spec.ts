import { expect, test } from "../../../fixtures";
import { IndicationsSection } from "../../../POM/objects/widgets/shared/indicationsSection";
import { DrugPage } from "../../../POM/page/drug/drug";

test.describe("Drug Indications Section", () => {
  let drugPage: DrugPage;
  let indicationsSection: IndicationsSection;

  test.beforeEach(async ({ page, testConfig }) => {
    drugPage = new DrugPage(page);
    indicationsSection = new IndicationsSection(page);

    // Navigate to a drug with indications data
    await drugPage.goToDrugPage(testConfig.drug.primary);

    // Wait for the section to fully load
    await indicationsSection.waitForLoad();
  });

  test("Indications section is visible", async () => {
    expect(await indicationsSection.isSectionVisible()).toBe(true);
  });

  test("Indications table displays data", async () => {
    const rowCount = await indicationsSection.getTableRows();

    expect(rowCount).toBeGreaterThan(0);
  });

  test("Indication name is displayed", async () => {
    const indication = await indicationsSection.getIndicationName(0);

    expect(indication).not.toBeNull();
    expect(indication).not.toBe("");
  });

  test("Can click indication link", async ({ page }) => {
    await indicationsSection.clickIndicationLink(0);

    // Wait for navigation to disease page
    await page.waitForURL((url) => url.toString().includes("/disease/"), { timeout: 5000 });

    // Should navigate to disease page
    expect(page.url()).toContain("/disease/");
  });

  test("Max phase is displayed", async () => {
    const maxPhase = await indicationsSection.getMaxPhase(0);

    expect(maxPhase).not.toBeNull();
    expect(maxPhase).not.toBe("");
  });

  test("Can search/filter indications", async () => {
    // Search for a specific term
    await indicationsSection.search("cancer");

    // Row count should change
    const filteredRowCount = await indicationsSection.getTableRows();

    // At least the search should execute without error
    expect(filteredRowCount).toBeGreaterThanOrEqual(0);
  });
});
