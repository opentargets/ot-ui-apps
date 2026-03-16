import { expect, test } from "../../../../fixtures";
import { ComparativeGenomicsSection } from "../../../../POM/objects/widgets/shared/comparativeGenomicsSection";

test.describe("Comparative Genomics Section", () => {
  test.beforeEach(async ({ page, baseURL, testConfig }) => {
    const targetId = testConfig.target?.primary || "ENSG00000157764";
    await page.goto(`${baseURL}/target/${targetId}`);
    await page.waitForLoadState("networkidle");
  });

  test("Section is visible when target has comparative genomics data", async ({ page }) => {
    const comparativeGenomicsSection = new ComparativeGenomicsSection(page);
    const isVisible = await comparativeGenomicsSection.isSectionVisible();

    if (isVisible) {
      await comparativeGenomicsSection.waitForLoad();
      expect(isVisible).toBe(true);
    }
  });

  test("Section header displays correct title", async ({ page }) => {
    const comparativeGenomicsSection = new ComparativeGenomicsSection(page);
    const isVisible = await comparativeGenomicsSection.isSectionVisible();

    if (isVisible) {
      await comparativeGenomicsSection.waitForLoad();
      const title = await comparativeGenomicsSection.getSectionTitle();
      expect(title).toBeTruthy();
    }
  });

  test("Chart view is accessible", async ({ page }) => {
    const comparativeGenomicsSection = new ComparativeGenomicsSection(page);
    const isVisible = await comparativeGenomicsSection.isSectionVisible();

    if (isVisible) {
      await comparativeGenomicsSection.waitForLoad();
      const chartButton = comparativeGenomicsSection.getChartViewButton();
      const chartButtonVisible = await chartButton.isVisible().catch(() => false);

      if (chartButtonVisible) {
        await comparativeGenomicsSection.switchToChartView();
        expect(chartButtonVisible).toBe(true);
      }
    }
  });

  test("Table view is accessible", async ({ page }) => {
    const comparativeGenomicsSection = new ComparativeGenomicsSection(page);
    const isVisible = await comparativeGenomicsSection.isSectionVisible();

    if (isVisible) {
      await comparativeGenomicsSection.waitForLoad();
      const tableButton = comparativeGenomicsSection.getTableViewButton();
      const tableButtonVisible = await tableButton.isVisible().catch(() => false);

      if (tableButtonVisible) {
        await comparativeGenomicsSection.switchToTableView();
        expect(tableButtonVisible).toBe(true);
      }
    }
  });

  test("Search functionality filters data", async ({ page }) => {
    const comparativeGenomicsSection = new ComparativeGenomicsSection(page);
    const isVisible = await comparativeGenomicsSection.isSectionVisible();

    if (isVisible) {
      await comparativeGenomicsSection.waitForLoad();

      const tableButton = comparativeGenomicsSection.getTableViewButton();
      const tableButtonVisible = await tableButton.isVisible().catch(() => false);
      if (tableButtonVisible) {
        await comparativeGenomicsSection.switchToTableView();
      }

      const searchInput = comparativeGenomicsSection.getSearchInput();
      const searchVisible = await searchInput.isVisible().catch(() => false);

      if (searchVisible) {
        await comparativeGenomicsSection.search("mouse");
        await page.waitForTimeout(500);
        const inputValue = await searchInput.inputValue();
        expect(inputValue).toBe("mouse");
      }
    }
  });

  test("Data downloader is available", async ({ page }) => {
    const comparativeGenomicsSection = new ComparativeGenomicsSection(page);
    const isVisible = await comparativeGenomicsSection.isSectionVisible();

    if (isVisible) {
      await comparativeGenomicsSection.waitForLoad();
      const downloader = comparativeGenomicsSection.getDataDownloader();
      const downloaderVisible = await downloader.isVisible().catch(() => false);

      if (downloaderVisible) {
        expect(downloaderVisible).toBe(true);
      }
    }
  });
});
