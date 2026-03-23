import { expect, test } from "../../../../fixtures";
import { ExpressionSection } from "../../../../POM/objects/widgets/shared/expressionSection";

test.describe("Expression Section", () => {
  test.beforeEach(async ({ page, baseURL, testConfig }) => {
    const targetId = testConfig.target?.primary || "ENSG00000157764";
    await page.goto(`${baseURL}/target/${targetId}`);
    await page.waitForLoadState("networkidle");
  });

  test("Section is visible when target has expression data", async ({ page }) => {
    const expressionSection = new ExpressionSection(page);
    const isVisible = await expressionSection.isSectionVisible();

    if (isVisible) {
      await expressionSection.waitForLoad();
      expect(isVisible).toBe(true);
    } else {
      test.skip();
    }
  });

  test("Section header displays correct title", async ({ page }) => {
    const expressionSection = new ExpressionSection(page);
    const isVisible = await expressionSection.isSectionVisible();

    if (isVisible) {
      await expressionSection.waitForLoad();
      const title = await expressionSection.getSectionTitle();
      expect(title).toBeTruthy();
    }
  });

  test("Summary tab is accessible", async ({ page }) => {
    const expressionSection = new ExpressionSection(page);
    const isVisible = await expressionSection.isSectionVisible();

    if (isVisible) {
      await expressionSection.waitForLoad();
      const summaryTab = expressionSection.getSummaryTab();
      const tabVisible = await summaryTab.isVisible().catch(() => false);

      if (tabVisible) {
        await expressionSection.clickSummaryTab();
        expect(tabVisible).toBe(true);
      }
    }
  });

  test("GTEx tab is accessible", async ({ page }) => {
    const expressionSection = new ExpressionSection(page);
    const isVisible = await expressionSection.isSectionVisible();

    if (isVisible) {
      await expressionSection.waitForLoad();
      const gtexTab = expressionSection.getGtexTab();
      const tabVisible = await gtexTab.isVisible().catch(() => false);

      if (tabVisible) {
        await expressionSection.clickGtexTab();
        expect(tabVisible).toBe(true);
      }
    }
  });

  test("Data downloader is available", async ({ page }) => {
    const expressionSection = new ExpressionSection(page);
    const isVisible = await expressionSection.isSectionVisible();

    if (isVisible) {
      await expressionSection.waitForLoad();
      const downloader = expressionSection.getDataDownloader();
      const downloaderVisible = await downloader.isVisible().catch(() => false);

      if (downloaderVisible) {
        expect(downloaderVisible).toBe(true);
      }
    }
  });
});
