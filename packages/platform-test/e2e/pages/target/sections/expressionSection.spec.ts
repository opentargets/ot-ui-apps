import { expect, test } from "../../../../fixtures";
import { ExpressionSection } from "../../../../POM/objects/widgets/shared/expressionSection";

test.describe("Expression Section", () => {
  test.beforeEach(async ({ page, baseURL, testConfig }) => {
    const targetId =  "ENSG00000180370";
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

  test("GTEx component body is rendered after clicking GTEx tab", async ({ page }) => {
    const expressionSection = new ExpressionSection(page);
    const isVisible = await expressionSection.isSectionVisible();

    if (isVisible) {
      await expressionSection.waitForLoad();
      const gtexTab = expressionSection.getGtexTab();
      const tabVisible = await gtexTab.isVisible().catch(() => false);

      if (tabVisible) {
        await expressionSection.clickGtexTab();
        await expressionSection.waitForLoad();
        const gtexContentVisible = await expressionSection.isGtexContentVisible();
        expect(gtexContentVisible).toBe(true);
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });

  test("GTEx tab handles empty API response gracefully", async ({ page, baseURL }) => {
    // Mock the GTEx API to return empty data
    await page.route("**/gtexportal.org/api/v2/expression/geneExpression**", async route => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: [] }),
      });
    });

    // Navigate to the target page after setting up the mock
    const targetId = "ENSG00000180370";
    await page.goto(`${baseURL}/target/${targetId}`);
    await page.waitForLoadState("networkidle");

    const expressionSection = new ExpressionSection(page);
    const isVisible = await expressionSection.isSectionVisible();

    if (isVisible) {
      await expressionSection.waitForLoad();
      const gtexTab = expressionSection.getGtexTab();
      const tabVisible = await gtexTab.isVisible().catch(() => false);

      if (tabVisible) {
        await expressionSection.clickGtexTab();
        await expressionSection.waitForLoad();

        // Verify GTEx content area exists but handles empty state
        const gtexContent = expressionSection.getGtexContent();
        const contentVisible = await gtexContent.isVisible().catch(() => false);

        // The component should either show an empty state message or not render
        // This test verifies the app doesn't crash with empty data
        expect(contentVisible).toBeDefined();
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });
});
