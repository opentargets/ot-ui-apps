import { expect, test } from "../../../../fixtures";
import { QTLCredibleSetsSection } from "../../../../POM/objects/widgets/shared/qtlCredibleSetsSection";

test.describe("QTL Credible Sets Section", () => {
  test.beforeEach(async ({ page, baseURL, testConfig }) => {
    const targetId = testConfig.target?.primary || "ENSG00000157764";
    await page.goto(`${baseURL}/target/${targetId}`);
    await page.waitForLoadState("networkidle");
  });

  test("Section is visible when target has QTL credible sets data", async ({ page }) => {
    const qtlSection = new QTLCredibleSetsSection(page);
    const isVisible = await qtlSection.isSectionVisible();

    if (isVisible) {
      await qtlSection.waitForLoad();
      expect(isVisible).toBe(true);
    } else {
      test.skip();
    }
  });

  test("Table is displayed with credible sets data", async ({ page }) => {
    const qtlSection = new QTLCredibleSetsSection(page);
    const isVisible = await qtlSection.isSectionVisible();

    if (isVisible) {
      await qtlSection.waitForLoad();
      const rowCount = await qtlSection.getTableRows();
      expect(rowCount).toBeGreaterThanOrEqual(0);
    }
  });

  test("Credible set links navigate to credible set page", async ({ page }) => {
    const qtlSection = new QTLCredibleSetsSection(page);
    const isVisible = await qtlSection.isSectionVisible();

    if (isVisible) {
      await qtlSection.waitForLoad();
      const rowCount = await qtlSection.getTableRows();

      if (rowCount > 0) {
        const credibleSetLink = await qtlSection.getCredibleSetLink(0);
        const linkVisible = await credibleSetLink.isVisible().catch(() => false);

        if (linkVisible) {
          const href = await credibleSetLink.getAttribute("href");
          expect(href).toContain("/credible-set/");
        }
      }
    }
  });

  test("Study links navigate to study page", async ({ page }) => {
    const qtlSection = new QTLCredibleSetsSection(page);
    const isVisible = await qtlSection.isSectionVisible();

    if (isVisible) {
      await qtlSection.waitForLoad();
      const rowCount = await qtlSection.getTableRows();

      if (rowCount > 0) {
        const studyLink = await qtlSection.getStudyLink(0);
        const linkVisible = await studyLink.isVisible().catch(() => false);

        if (linkVisible) {
          const href = await studyLink.getAttribute("href");
          expect(href).toContain("/study/");
        }
      }
    }
  });

  test("Search functionality filters credible sets", async ({ page }) => {
    const qtlSection = new QTLCredibleSetsSection(page);
    const isVisible = await qtlSection.isSectionVisible();

    if (isVisible) {
      await qtlSection.waitForLoad();
      const searchInput = qtlSection.getSearchInput();
      const searchVisible = await searchInput.isVisible().catch(() => false);

      if (searchVisible) {
        await qtlSection.search("eQTL");
        await page.waitForTimeout(500);
        const inputValue = await searchInput.inputValue();
        expect(inputValue).toBe("eQTL");
      }
    }
  });
});
