import { test } from "@playwright/test";
import { DiseasePage } from "../../POM/disease/disease";

test.describe("Disease Page", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/disease/EFO_0000612/associations`);
  });

  test("Can navigate to the profile page from the disease page", async ({ page }) => {
    const diseasePage = new DiseasePage(page);
    await diseasePage.goToProfilePage();

    // Verify that the URL is the profile page URL
    await test.expect(page.url()).toBe(diseasePage.getProfilePage());
  });
});