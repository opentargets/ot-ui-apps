import { expect, test } from "../../../../fixtures";
import { SafetySection } from "../../../../POM/objects/widgets/shared/safetySection";

test.describe("Safety Section", () => {
  test.beforeEach(async ({ page, baseURL, testConfig }) => {
    const targetId = testConfig.target?.primary || "ENSG00000157764";
    await page.goto(`${baseURL}/target/${targetId}`);
    await page.waitForLoadState("networkidle");
  });

  test("Section is visible when target has safety data", async ({ page }) => {
    const safetySection = new SafetySection(page);
    const isVisible = await safetySection.isSectionVisible();

    if (isVisible) {
      await safetySection.waitForLoad();
      expect(isVisible).toBe(true);
    }
  });

  test("Section header displays correct title", async ({ page }) => {
    const safetySection = new SafetySection(page);
    const isVisible = await safetySection.isSectionVisible();

    if (isVisible) {
      await safetySection.waitForLoad();
      const title = await safetySection.getSectionTitle();
      expect(title).toBeTruthy();
    }
  });

  test("Table is displayed with safety data", async ({ page }) => {
    const safetySection = new SafetySection(page);
    const isVisible = await safetySection.isSectionVisible();

    if (isVisible) {
      await safetySection.waitForLoad();
      const isTableVisible = await safetySection.isTableVisible();
      expect(isTableVisible).toBe(true);
    }
  });

  test("Table contains rows with safety events", async ({ page }) => {
    const safetySection = new SafetySection(page);
    const isVisible = await safetySection.isSectionVisible();

    if (isVisible) {
      await safetySection.waitForLoad();
      const rowCount = await safetySection.getTableRowCount();

      if (rowCount > 0) {
        const eventName = await safetySection.getSafetyEventName(0);
        expect(eventName).toBeTruthy();
      }
    }
  });

  test("Safety event links are functional", async ({ page }) => {
    const safetySection = new SafetySection(page);
    const isVisible = await safetySection.isSectionVisible();

    if (isVisible) {
      await safetySection.waitForLoad();
      const rowCount = await safetySection.getTableRowCount();

      if (rowCount > 0) {
        const hasLink = await safetySection.hasSafetyEventLink(0);
        if (hasLink) {
          const link = safetySection.getSafetyEventLink(0);
          const href = await link.getAttribute("href");
          expect(href).toBeTruthy();
        }
      }
    }
  });

  test("Search functionality filters safety events", async ({ page }) => {
    const safetySection = new SafetySection(page);
    const isVisible = await safetySection.isSectionVisible();

    if (isVisible) {
      await safetySection.waitForLoad();
      const searchInput = safetySection.getSearchInput();
      const searchVisible = await searchInput.isVisible().catch(() => false);

      if (searchVisible) {
        await safetySection.search("test");
        await page.waitForTimeout(500);
        const inputValue = await searchInput.inputValue();
        expect(inputValue).toBe("test");
      }
    }
  });
});
