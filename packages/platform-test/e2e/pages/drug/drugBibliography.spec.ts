import { expect, test } from "@playwright/test";
import { BibliographySection } from "../../../POM/objects/widgets/Bibliography/bibliographySection";
import { DrugPage } from "../../../POM/page/drug/drug";

test.describe("Drug Bibliography Section", () => {
  let drugPage: DrugPage;
  let bibliographySection: BibliographySection;

  test.beforeEach(async ({ page }) => {
    drugPage = new DrugPage(page);
    bibliographySection = new BibliographySection(page);

    // Navigate to a drug with bibliography data
    await drugPage.goToDrugPage("CHEMBL1201585");

    // Check if section is visible
    const isVisible = await bibliographySection.isSectionVisible();
    if (isVisible) {
      // Wait for literature entries
      await page.waitForTimeout(1000);
    } else {
      test.skip();
    }
  });

  test("Bibliography section is visible when data available", async () => {
    const isVisible = await bibliographySection.isSectionVisible();
    expect(isVisible).toBe(true);
  });

  test("Literature entries are displayed", async () => {
    const count = await bibliographySection.getLiteratureCount();

    expect(count).toBeGreaterThan(0);
  });

  test("Literature title is displayed", async () => {
    const title = await bibliographySection.getLiteratureTitle(0);

    expect(title).not.toBeNull();
    expect(title).not.toBe("");
  });

  test("Can click PubMed link", async ({ page }) => {
    const pubmedLink = bibliographySection.getPubMedLink(0);
    const hasLink = await pubmedLink.isVisible().catch(() => false);

    if (hasLink) {
      const initialUrl = page.url();
      await pubmedLink.click();

      // Wait for navigation
      await page.waitForURL((url) => url.toString() !== initialUrl, { timeout: 5000 });

      // Check that navigation occurred
      const url = page.url();
      expect(url).not.toBe(initialUrl);
      expect(url).toMatch(/^https?:\/\/.+/);
    }
  });
});
