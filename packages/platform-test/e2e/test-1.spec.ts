import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.getByRole("link", { name: "ACHE" }).click();
  await page.getByRole("tab", { name: "Profile" }).click();
});
