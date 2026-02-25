import { expect, test } from "../../../fixtures";
import { DrugHeader } from "../../../POM/objects/components/DrugHeader/drugHeader";
import { DrugPage } from "../../../POM/page/drug/drug";

test.describe("Drug Header", () => {
  let drugPage: DrugPage;
  let drugHeader: DrugHeader;

  test.beforeEach(async ({ page, testConfig }) => {
    drugPage = new DrugPage(page);
    drugHeader = new DrugHeader(page);

    // Navigate to a drug page
    await drugPage.goToDrugPage(testConfig.drug.primary);

    // Wait for header to load
    await drugHeader.waitForHeaderLoad();
  });

  test("Drug header is visible", async () => {
    expect(await drugHeader.isHeaderVisible()).toBe(true);
  });

  test("Drug title is displayed", async () => {
    const isVisible = await drugHeader.isDrugTitleVisible();
    expect(isVisible).toBe(true);

    const drugName = await drugHeader.getDrugName();
    expect(drugName).not.toBeNull();
    expect(drugName).not.toBe("");
  });

  test("External links section is visible", async () => {
    const hasLinks = await drugHeader.hasExternalLinks();
    expect(hasLinks).toBe(true);
  });

  test("ChEMBL link is displayed", async () => {
    const hasChembl = await drugHeader.hasChemblLink();
    expect(hasChembl).toBe(true);
  });

  test("Can click ChEMBL link", async ({ page }) => {
    const initialUrl = page.url();
    await drugHeader.clickChemblLink();

    // Wait for navigation to external site
    await page.waitForURL((url) => url.toString() !== initialUrl, { timeout: 5000 });

    // Check that navigation occurred
    const url = page.url();
    expect(url).not.toBe(initialUrl);
    expect(url).toMatch(/^https?:\/\/.+/);
  });

  test("External links are displayed when available", async () => {
    const linksCount = await drugHeader.getExternalLinksCount();
    expect(linksCount).toBeGreaterThan(0);
  });

  test("DrugBank link may be displayed", async () => {
    const hasDrugBank = await drugHeader.hasDrugBankLink();
    // DrugBank link is optional, so we just check it doesn't throw
    expect(typeof hasDrugBank).toBe("boolean");
  });

  test("ChEBI link may be displayed", async () => {
    const hasChebi = await drugHeader.hasChebiLink();
    // ChEBI link is optional, so we just check it doesn't throw
    expect(typeof hasChebi).toBe("boolean");
  });

  test("DailyMed link may be displayed", async () => {
    const hasDailyMed = await drugHeader.hasDailyMedLink();
    // DailyMed link is optional, so we just check it doesn't throw
    expect(typeof hasDailyMed).toBe("boolean");
  });

  test("DrugCentral link may be displayed", async () => {
    const hasDrugCentral = await drugHeader.hasDrugCentralLink();
    // DrugCentral link is optional, so we just check it doesn't throw
    expect(typeof hasDrugCentral).toBe("boolean");
  });

  test("Wikipedia link may be displayed", async () => {
    const hasWikipedia = await drugHeader.hasWikipediaLink();
    // Wikipedia link is optional, so we just check it doesn't throw
    expect(typeof hasWikipedia).toBe("boolean");
  });
});
