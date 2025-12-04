import { test, expect } from "@playwright/test";

test("Validate page title", async ({ page, baseURL }) => {
  await page.goto(baseURL!);
  const title = await page.title();
  await expect(title).toBe("Open Targets Platform");
});
