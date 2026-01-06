import { test as base } from "@playwright/test";
import { getTestConfig, type TestConfig } from "./testConfig";

/**
 * Extended test fixtures with test configuration
 */
type TestFixtures = {
  testConfig: TestConfig;
};

/**
 * Extend Playwright test with custom fixtures
 */
export const test = base.extend<TestFixtures>({
  // biome-ignore lint/correctness/noEmptyPattern: <an empty pattern is required>
  testConfig: async ({}, use) => {
    // Fetch configuration once per test
    const config = await getTestConfig();
    await use(config);
  },
});

export { expect } from "@playwright/test";
