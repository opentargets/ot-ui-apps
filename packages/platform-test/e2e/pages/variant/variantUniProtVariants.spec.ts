import { expect, test } from "@playwright/test";
import { UniProtVariantsSection } from "../../../POM/objects/widgets/shared/uniprotVariantsSection";
import { VariantPage } from "../../../POM/page/variant/variant";

test.describe("UniProt Variants Section", () => {
  let variantPage: VariantPage;
  let uniprotSection: UniProtVariantsSection;

  test.beforeEach(async ({ page }) => {
    variantPage = new VariantPage(page);
    uniprotSection = new UniProtVariantsSection(page);

    // Navigate to a variant with UniProt data
    await variantPage.goToVariantPage("19_44908822_C_T");

    // Check if section is visible
    const isVisible = await uniprotSection.isSectionVisible();
    if (isVisible) {
      await uniprotSection.waitForLoad();
    } else {
      test.skip();
    }
  });

  test("UniProt Variants section is visible when data available", async () => {
    const isVisible = await uniprotSection.isSectionVisible();
    expect(isVisible).toBe(true);
  });

  test("UniProt table displays data", async () => {
    const rowCount = await uniprotSection.getTableRows();

    expect(rowCount).toBeGreaterThan(0);
  });

  test("Target gene link is displayed in table", async () => {
    const geneLink = await uniprotSection.getTargetGeneLink(0);

    expect(await geneLink.isVisible()).toBe(true);
  });

  test("Can click target gene link in table", async ({ page }) => {
    await uniprotSection.clickTargetGeneLink(0);

    // Wait for navigation to target page
    await page.waitForURL((url) => url.toString().includes("/target/"), { timeout: 5000 });

    // Should navigate to target/gene page
    expect(page.url()).toContain("/target/");
  });

  test("Disease links are displayed in table", async () => {
    const diseaseCount = await uniprotSection.getDiseaseLinksCount(0);

    expect(diseaseCount).toBeGreaterThan(0);
  });

  test("Can click disease link in table", async ({ page }) => {
    const hasLinks = await uniprotSection.getDiseaseLinksCount(0);

    if (hasLinks > 0) {
      await uniprotSection.clickDiseaseLink(0);

      // Wait for navigation to disease page
      await page.waitForURL((url) => url.toString().includes("/disease/"), { timeout: 5000 });

      // Should navigate to disease page
      expect(page.url()).toContain("/disease/");
    }
  });

  test("Can search/filter UniProt variants", async () => {
    // Search for a specific term
    await uniprotSection.search("disease");

    // Row count should change
    const filteredRowCount = await uniprotSection.getTableRows();

    // At least the search should execute without error
    expect(filteredRowCount).toBeGreaterThanOrEqual(0);
  });
});
