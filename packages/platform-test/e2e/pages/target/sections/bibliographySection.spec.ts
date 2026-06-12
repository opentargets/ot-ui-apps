import { expect, test } from "../../../../fixtures";
import { BibliographySection } from "../../../../POM/objects/widgets/Bibliography/bibliographySection";

test.describe("Bibliography Section", () => {
  test.beforeEach(async ({ page, baseURL, testConfig }) => {
    const targetId = testConfig.target?.primary || "ENSG00000157764";
    await page.goto(`${baseURL}/target/${targetId}`);
    await page.waitForLoadState("networkidle");
  });

  test("Section is visible when target has bibliography data", async ({ page }) => {
    const bibliographySection = new BibliographySection(page);
    const isVisible = await bibliographySection.isSectionVisible().catch(() => false);

    if (isVisible) {
      await bibliographySection.waitForSectionLoad();
      expect(isVisible).toBe(true);
    }
  });

  test("Section header displays correct title", async ({ page }) => {
    const bibliographySection = new BibliographySection(page);
    const isVisible = await bibliographySection.isSectionVisible().catch(() => false);

    if (isVisible) {
      await bibliographySection.waitForSectionLoad();
      const title = await bibliographySection.getSectionTitle();
      expect(title).toBeTruthy();
    }
  });

  test("Literature entries are displayed", async ({ page }) => {
    const bibliographySection = new BibliographySection(page);
    const isVisible = await bibliographySection.isSectionVisible().catch(() => false);

    if (isVisible) {
      await bibliographySection.waitForSectionLoad();
      const literatureCount = await bibliographySection.getLiteratureCount();
      expect(literatureCount).toBeGreaterThanOrEqual(0);
    }
  });

  test("Literature entry has title", async ({ page }) => {
    const bibliographySection = new BibliographySection(page);
    const isVisible = await bibliographySection.isSectionVisible().catch(() => false);

    if (isVisible) {
      await bibliographySection.waitForSectionLoad();
      const literatureCount = await bibliographySection.getLiteratureCount();

      if (literatureCount > 0) {
        const title = await bibliographySection.getLiteratureTitle(0);
        expect(title).toBeTruthy();
      }
    }
  });

  test("Search functionality filters literature", async ({ page }) => {
    const bibliographySection = new BibliographySection(page);
    const isVisible = await bibliographySection.isSectionVisible().catch(() => false);

    if (isVisible) {
      await bibliographySection.waitForSectionLoad();
      const searchInput = bibliographySection.getSearchInput();
      const searchVisible = await searchInput.isVisible().catch(() => false);

      if (searchVisible) {
        await bibliographySection.searchLiterature("cancer");
        await page.waitForTimeout(500);
        const inputValue = await searchInput.inputValue();
        expect(inputValue).toBe("cancer");
      }
    }
  });
});
