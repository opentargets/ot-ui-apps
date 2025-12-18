import { expect, type Locator, test } from "@playwright/test";

// https://github.com/microsoft/playwright/issues/36395
// Helper function to fill input with polling to avoid flaky tests
async function fillPolling(locator: Locator, value: string) {
  await expect
    .poll(async () => {
      await locator.fill(value);
      return await locator.inputValue();
    })
    .toEqual(value);
}

test.describe("Home page actions", () => {
  test("Validate page title", async ({ page, baseURL }) => {
    await page.goto(baseURL!);
    const title = await page.title();
    await expect(title).toBe("Open Targets Platform");
  });

  test.describe("Search functionality", () => {
    let searchInput: Locator;

    test.beforeEach(async ({ page, baseURL }) => {
      await page.goto(baseURL!);
      await page.getByTestId("global-search-input-trigger").click();

      // Verify that the global search input is rendered
      searchInput = page.getByTestId("global-search-input");
      await expect(searchInput).toBeVisible();

      // Fill the search input with myocardial infarction
      await fillPolling(searchInput, "myocardial infarction");
    });

    test("Search page is functional, when user visits the homepage", async ({ page }) => {
      await expect(searchInput).toHaveValue("myocardial infarction");

      // Submit the search form
      await searchInput.press("Enter");

      // Verify that the URL contains the search query
      await expect(page).toHaveURL(/.*search.*/);
    });

    test("Search suggestions is functional and displayed correctly", async ({ page }) => {
      const topHit = await page.getByTestId("top-hit-list-item-topHit");
      await expect(topHit).toBeVisible();

      const targets = await page.getByTestId("top-hit-list-item-targets");
      await expect(targets).toBeVisible();

      const gwas_studies = await page.getByTestId("top-hit-list-item-studies");
      await expect(gwas_studies).toBeVisible();

      const diseases = await page.getByTestId("top-hit-list-item-diseases");
      await expect(diseases).toBeVisible();

      const drugs = await page.getByTestId("top-hit-list-item-drugs");
      await expect(drugs).toBeVisible();

      await page.getByTestId("top-hit-list-result-item").first().click();

      // Verify that the URL contains the disease page
      await expect(page).toHaveURL(/.*disease\.*/);
    });

    test("Can go to the disease page from the search suggestions", async ({ page }) => {
      // Filter by only disease
      await page.getByTestId("entity-filter-disease").first().click();

      const diseases = await page.getByTestId("top-hit-list-item-diseases");
      await expect(diseases).toBeVisible();

      await page.getByTestId("top-hit-list-result-item").first().click();

      // Verify that the URL contains the disease page
      await expect(page).toHaveURL(/.*disease\.*/);
    });
  });
});
