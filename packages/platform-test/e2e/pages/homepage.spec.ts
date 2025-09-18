import { test, expect } from "@playwright/test";

const devURL = "http://localhost:4173"; // TODO: move to env variable

test("Validate page title", async ({ page }) => {
  await page.goto(devURL);
  await expect(page).toHaveTitle("Open Targets Platform");
});
