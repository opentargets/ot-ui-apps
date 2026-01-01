import { expect, test } from "@playwright/test";
import { GWASCredibleSetsSection as VariantGWASCredibleSetsSection } from "../../../POM/objects/widgets/shared/GWASCredibleSetsSection";
import { VariantPage } from "../../../POM/page/variant/variant";

test.describe("Variant GWAS Credible Sets Section", () => {
  let variantPage: VariantPage;
  let gwasSection: VariantGWASCredibleSetsSection;

  test.beforeEach(async ({ page }) => {
    variantPage = new VariantPage(page);
    gwasSection = new VariantGWASCredibleSetsSection(page);

    // Navigate to a variant with GWAS credible sets data
    await variantPage.goToVariantPage("1_154453788_C_T");

    // Wait for the section to fully load
    await gwasSection.waitForLoad();
  });

  test("GWAS Credible Sets section is visible", async () => {
    expect(await gwasSection.isSectionVisible()).toBe(true);
  });

  test("GWAS Credible Sets table displays data", async () => {
    const rowCount = await gwasSection.getTableRows();

    expect(rowCount).toBeGreaterThan(0);
  });

  test("Can get credible set ID from table", async () => {
    const credibleSetId = await gwasSection.getCredibleSetId(0);

    expect(credibleSetId).not.toBeNull();
    expect(credibleSetId).not.toBe("");
  });

  test("Can click credible set link in table", async ({ page }) => {
    await gwasSection.clickCredibleSetLink(0);

    // Wait for navigation to credible set page
    await page.waitForURL((url) => url.toString().includes("/credible-set/"), { timeout: 5000 });

    // Should navigate to credible set page
    expect(page.url()).toContain("/credible-set/");
  });

  test("Lead variant column displays correctly", async () => {
    const hasLeadVariant = await gwasSection.hasLeadVariantLink(0);

    // Lead variant might be the current variant (no link) or a different variant (with link)
    // Either way, the cell should have content
    const row = await gwasSection.getTableRow(0);
    const leadVariantCell = row.locator("td").nth(1);
    const content = await leadVariantCell.textContent();

    expect(content).not.toBeNull();
  });

  test("Can click lead variant link when available", async ({ page }) => {
    const hasLink = await gwasSection.hasLeadVariantLink(0);

    if (hasLink) {
      await gwasSection.clickLeadVariantLink(0);

      // Wait for navigation to variant page
      await page.waitForURL((url) => url.toString().includes("/variant/"), { timeout: 5000 });

      // Should navigate to a variant page
      expect(page.url()).toContain("/variant/");
    }
  });

  test("Disease links are displayed in table", async () => {
    const diseaseCount = await gwasSection.getDiseaseLinksCount(0);

    expect(diseaseCount).toBeGreaterThan(0);
  });

  test("Can click disease link in table", async ({ page }) => {
    await gwasSection.clickDiseaseLink(0);

    // Wait for navigation to disease page
    await page.waitForURL((url) => url.toString().includes("/disease/"), { timeout: 5000 });

    // Should navigate to disease page
    expect(page.url()).toContain("/disease/");
  });

  test("Study ID is displayed in table", async () => {
    const studyId = await gwasSection.getStudyId(0);

    expect(studyId).not.toBeNull();
    expect(studyId).not.toBe("");
  });

  test("Can click study link in table", async ({ page }) => {
    await gwasSection.clickStudyLink(0);

    // Wait for navigation to study page
    await page.waitForURL((url) => url.toString().includes("/study/"), { timeout: 5000 });

    // Should navigate to study page
    expect(page.url()).toContain("/study/");
  });

  test("L2G gene link is displayed when available", async () => {
    const hasL2GLink = await gwasSection.hasL2GGeneLink(0);

    if (hasL2GLink) {
      const geneName = await gwasSection.getL2GGeneName(0);
      expect(geneName).not.toBeNull();
      expect(geneName).not.toBe("");
    }
  });

  test("Can click L2G gene link", async ({ page }) => {
    const hasL2GLink = await gwasSection.hasL2GGeneLink(0);

    if (hasL2GLink) {
      await gwasSection.clickL2GGeneLink(0);

      // Wait for navigation to target page
      await page.waitForURL((url) => url.toString().includes("/target/"), { timeout: 5000 });

      // Should navigate to target page
      expect(page.url()).toContain("/target/");
    }
  });

  test("Pagination buttons work correctly", async () => {
    const rowCount = await gwasSection.getTableRows();

    // If we have enough rows for pagination
    if (rowCount >= 10) {
      const nextEnabled = await gwasSection.isNextPageEnabled();

      if (nextEnabled) {
        await gwasSection.clickNextPage();

        // Should still be on the same section
        expect(await gwasSection.isSectionVisible()).toBe(true);

        // Previous button should now be enabled
        expect(await gwasSection.isPreviousPageEnabled()).toBe(true);
      }
    }
  });

  test("Search functionality works", async () => {
    const initialRows = await gwasSection.getTableRows();

    // Search for a specific study or trait
    await gwasSection.search("PCSK9");

    const filteredRows = await gwasSection.getTableRows();

    // Filtered results should be less than or equal to initial rows
    expect(filteredRows).toBeLessThanOrEqual(initialRows);
  });

  test("Can clear search", async () => {
    await gwasSection.search("PCSK9");
    await gwasSection.clearSearch();

    // Should show all rows again
    const rowCount = await gwasSection.getTableRows();
    expect(rowCount).toBeGreaterThan(0);
  });
});
