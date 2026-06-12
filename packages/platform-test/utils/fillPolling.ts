import { expect, type Locator } from "@playwright/test";

// https://github.com/microsoft/playwright/issues/36395
// Helper function to fill input with polling to avoid flaky tests
export async function fillPolling(locator: Locator, value: string) {
  await expect
    .poll(async () => {
      await locator.fill(value);
      return await locator.inputValue();
    })
    .toEqual(value);
}
