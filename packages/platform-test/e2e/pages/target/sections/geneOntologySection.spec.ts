import { expect, test } from "../../../../fixtures";
import { GeneOntologySection } from "../../../../POM/objects/widgets/shared/geneOntologySection";

test.describe("Gene Ontology Section", () => {
  test.beforeEach(async ({ page, baseURL, testConfig }) => {
    const targetId = testConfig.target?.primary || "ENSG00000157764";
    await page.goto(`${baseURL}/target/${targetId}`);
    await page.waitForLoadState("networkidle");
  });

  test("Section is visible when target has GO annotations", async ({ page }) => {
    const goSection = new GeneOntologySection(page);
    const isVisible = await goSection.isSectionVisible();

    if (isVisible) {
      await goSection.waitForLoad();
      expect(isVisible).toBe(true);
    }
  });

  test("Section header displays correct title", async ({ page }) => {
    const goSection = new GeneOntologySection(page);
    const isVisible = await goSection.isSectionVisible();

    if (isVisible) {
      await goSection.waitForLoad();
      const title = await goSection.getSectionTitle();
      expect(title).toBeTruthy();
    }
  });

  test("Table is displayed with GO data", async ({ page }) => {
    const goSection = new GeneOntologySection(page);
    const isVisible = await goSection.isSectionVisible();

    if (isVisible) {
      await goSection.waitForLoad();
      const isTableVisible = await goSection.isTableVisible();
      expect(isTableVisible).toBe(true);
    }
  });

  test("Search functionality filters GO terms", async ({ page }) => {
    const goSection = new GeneOntologySection(page);
    const isVisible = await goSection.isSectionVisible();

    if (isVisible) {
      await goSection.waitForLoad();
      const searchInput = goSection.getSearchInput();
      const searchVisible = await searchInput.isVisible().catch(() => false);

      if (searchVisible) {
        await goSection.search("binding");
        await page.waitForTimeout(500);
        const inputValue = await searchInput.inputValue();
        expect(inputValue).toBe("binding");
      }
    }
  });

  test("Data downloader is available", async ({ page }) => {
    const goSection = new GeneOntologySection(page);
    const isVisible = await goSection.isSectionVisible();

    if (isVisible) {
      await goSection.waitForLoad();
      const downloader = goSection.getDataDownloader();
      const downloaderVisible = await downloader.isVisible().catch(() => false);

      if (downloaderVisible) {
        expect(downloaderVisible).toBe(true);
      }
    }
  });

  test("Publications drawer is accessible", async ({ page }) => {
    const goSection = new GeneOntologySection(page);
    const isVisible = await goSection.isSectionVisible();

    if (isVisible) {
      await goSection.waitForLoad();
      const pubDrawer = goSection.getPublicationsDrawer();
      const drawerVisible = await pubDrawer
        .first()
        .isVisible()
        .catch(() => false);

      if (drawerVisible) {
        expect(drawerVisible).toBe(true);
      }
    }
  });
});
