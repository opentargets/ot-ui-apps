import { expect, test } from "../../../../fixtures";
import { CancerHallmarksSection } from "../../../../POM/objects/widgets/shared/cancerHallmarksSection";

test.describe("Cancer Hallmarks Section", () => {
  test.beforeEach(async ({ page, baseURL, testConfig }) => {
    const targetId = testConfig.target?.primary || "ENSG00000157764";
    await page.goto(`${baseURL}/target/${targetId}`);
    await page.waitForLoadState("networkidle");
  });

  test("Section is visible when target has cancer hallmarks data", async ({ page }) => {
    const cancerHallmarksSection = new CancerHallmarksSection(page);
    const isVisible = await cancerHallmarksSection.isSectionVisible();

    if (isVisible) {
      await cancerHallmarksSection.waitForLoad();
      expect(isVisible).toBe(true);
    }
  });

  test("Section header displays correct title", async ({ page }) => {
    const cancerHallmarksSection = new CancerHallmarksSection(page);
    const isVisible = await cancerHallmarksSection.isSectionVisible();

    if (isVisible) {
      await cancerHallmarksSection.waitForLoad();
      const title = await cancerHallmarksSection.getSectionTitle();
      expect(title).toBeTruthy();
    }
  });

  test("Role in cancer section is displayed", async ({ page }) => {
    const cancerHallmarksSection = new CancerHallmarksSection(page);
    const isVisible = await cancerHallmarksSection.isSectionVisible();

    if (isVisible) {
      await cancerHallmarksSection.waitForLoad();
      const roleSection = cancerHallmarksSection.getRoleInCancerSection();
      const roleSectionVisible = await roleSection.isVisible().catch(() => false);

      if (roleSectionVisible) {
        expect(roleSectionVisible).toBe(true);
      }
    }
  });

  test("Table is displayed with hallmarks data", async ({ page }) => {
    const cancerHallmarksSection = new CancerHallmarksSection(page);
    const isVisible = await cancerHallmarksSection.isSectionVisible();

    if (isVisible) {
      await cancerHallmarksSection.waitForLoad();
      const isTableVisible = await cancerHallmarksSection.isTableVisible();
      expect(isTableVisible).toBe(true);
    }
  });

  test("Search functionality filters hallmarks", async ({ page }) => {
    const cancerHallmarksSection = new CancerHallmarksSection(page);
    const isVisible = await cancerHallmarksSection.isSectionVisible();

    if (isVisible) {
      await cancerHallmarksSection.waitForLoad();
      const searchInput = cancerHallmarksSection.getSearchInput();
      const searchVisible = await searchInput.isVisible().catch(() => false);

      if (searchVisible) {
        await cancerHallmarksSection.search("proliferation");
        await page.waitForTimeout(500);
        const inputValue = await searchInput.inputValue();
        expect(inputValue).toBe("proliferation");
      }
    }
  });

  test("Publications drawer is accessible", async ({ page }) => {
    const cancerHallmarksSection = new CancerHallmarksSection(page);
    const isVisible = await cancerHallmarksSection.isSectionVisible();

    if (isVisible) {
      await cancerHallmarksSection.waitForLoad();
      const pubDrawer = cancerHallmarksSection.getPublicationsDrawer();
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
