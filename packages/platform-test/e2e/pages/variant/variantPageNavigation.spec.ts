import { expect, test } from "@playwright/test";
import { VariantPage } from "../../../POM/page/variant/variant";

test.describe("Variant Page Navigation", () => {
  let variantPage: VariantPage;

  test.beforeEach(async ({ page }) => {
    variantPage = new VariantPage(page);
  });

  test("Can navigate to variant page directly by variant ID", async ({ page }) => {
    const variantId = "1_154453788_C_T";

    await variantPage.goToVariantPage(variantId);

    // Verify we're on the variant page
    expect(await variantPage.isVariantPage()).toBe(true);

    // Verify the URL contains the variant ID
    expect(page.url()).toContain(`/variant/${variantId}`);
  });

  test("Can get variant ID from page header", async () => {
    const variantId = "1_154453788_C_T";

    await variantPage.goToVariantPage(variantId);

    const headerVariantId = await variantPage.getVariantIdFromHeader();

    // The header displays the variant ID (may have formatting)
    expect(headerVariantId).toContain("1");
    expect(headerVariantId).toContain("154453788");
  });

  test("Variant page loads successfully with profile header", async ({ page }) => {
    const variantId = "1_154453788_C_T";

    await variantPage.goToVariantPage(variantId);

    // Wait for page to load
    await variantPage.waitForVariantPageLoad();

    // Verify profile header block is visible
    const profileHeaderBlock = page.locator("[data-testid='profile-page-header-block']");
    await expect(profileHeaderBlock).toBeVisible();
  });
});
