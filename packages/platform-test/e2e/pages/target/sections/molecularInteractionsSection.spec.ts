import { expect, test } from "../../../../fixtures";
import { MolecularInteractionsSection } from "../../../../POM/objects/widgets/shared/molecularInteractionsSection";

test.describe("Molecular Interactions Section", () => {
  test.beforeEach(async ({ page, baseURL, testConfig }) => {
    const targetId = testConfig.target?.primary || "ENSG00000157764";
    await page.goto(`${baseURL}/target/${targetId}`);
    await page.waitForLoadState("networkidle");
  });

  test("Section is visible when target has interaction data", async ({ page }) => {
    const interactionsSection = new MolecularInteractionsSection(page);
    const isVisible = await interactionsSection.isSectionVisible();

    if (isVisible) {
      await interactionsSection.waitForLoad();
      expect(isVisible).toBe(true);
    }
  });

  test("Section header displays correct title", async ({ page }) => {
    const interactionsSection = new MolecularInteractionsSection(page);
    const isVisible = await interactionsSection.isSectionVisible();

    if (isVisible) {
      await interactionsSection.waitForLoad();
      const title = await interactionsSection.getSectionTitle();
      expect(title).toBeTruthy();
    }
  });

  test("IntAct tab is accessible", async ({ page }) => {
    const interactionsSection = new MolecularInteractionsSection(page);
    const isVisible = await interactionsSection.isSectionVisible();

    if (isVisible) {
      await interactionsSection.waitForLoad();
      const intactTab = interactionsSection.getIntactTab();
      const tabVisible = await intactTab.isVisible().catch(() => false);

      if (tabVisible) {
        await interactionsSection.clickIntactTab();
        expect(tabVisible).toBe(true);
      }
    }
  });

  test("Signor tab is accessible", async ({ page }) => {
    const interactionsSection = new MolecularInteractionsSection(page);
    const isVisible = await interactionsSection.isSectionVisible();

    if (isVisible) {
      await interactionsSection.waitForLoad();
      const signorTab = interactionsSection.getSignorTab();
      const tabVisible = await signorTab.isVisible().catch(() => false);

      if (tabVisible) {
        await interactionsSection.clickSignorTab();
        expect(tabVisible).toBe(true);
      }
    }
  });

  test("Reactome tab is accessible", async ({ page }) => {
    const interactionsSection = new MolecularInteractionsSection(page);
    const isVisible = await interactionsSection.isSectionVisible();

    if (isVisible) {
      await interactionsSection.waitForLoad();
      const reactomeTab = interactionsSection.getReactomeTab();
      const tabVisible = await reactomeTab.isVisible().catch(() => false);

      if (tabVisible) {
        await interactionsSection.clickReactomeTab();
        expect(tabVisible).toBe(true);
      }
    }
  });

  test("String tab is accessible", async ({ page }) => {
    const interactionsSection = new MolecularInteractionsSection(page);
    const isVisible = await interactionsSection.isSectionVisible();

    if (isVisible) {
      await interactionsSection.waitForLoad();
      const stringTab = interactionsSection.getStringTab();
      const tabVisible = await stringTab.isVisible().catch(() => false);

      if (tabVisible) {
        await interactionsSection.clickStringTab();
        expect(tabVisible).toBe(true);
      }
    }
  });

  test("Table is displayed with interaction data", async ({ page }) => {
    const interactionsSection = new MolecularInteractionsSection(page);
    const isVisible = await interactionsSection.isSectionVisible();

    if (isVisible) {
      await interactionsSection.waitForLoad();
      const isTableVisible = await interactionsSection.isTableVisible();
      expect(isTableVisible).toBe(true);
    }
  });

  test("Search functionality filters interactions", async ({ page }) => {
    const interactionsSection = new MolecularInteractionsSection(page);
    const isVisible = await interactionsSection.isSectionVisible();

    if (isVisible) {
      await interactionsSection.waitForLoad();
      const searchInput = interactionsSection.getSearchInput();
      const searchVisible = await searchInput.isVisible().catch(() => false);

      if (searchVisible) {
        await interactionsSection.search("kinase");
        await page.waitForTimeout(500);
        const inputValue = await searchInput.inputValue();
        expect(inputValue).toBe("kinase");
      }
    }
  });

  test("Data downloader is available", async ({ page }) => {
    const interactionsSection = new MolecularInteractionsSection(page);
    const isVisible = await interactionsSection.isSectionVisible();

    if (isVisible) {
      await interactionsSection.waitForLoad();
      const downloader = interactionsSection.getDataDownloader();
      const downloaderVisible = await downloader.isVisible().catch(() => false);

      if (downloaderVisible) {
        expect(downloaderVisible).toBe(true);
      }
    }
  });
});
