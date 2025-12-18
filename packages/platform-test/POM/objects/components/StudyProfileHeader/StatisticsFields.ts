import type { Locator, Page } from "@playwright/test";

/**
 * Helper class for summary statistics and QC warnings
 */
export class StatisticsFields {
  constructor(private page: Page) {}

  // Summary statistics
  getSummaryStatsField(): Locator {
    return this.page.locator("[data-testid='field-summary-statistics']");
  }

  async getSummaryStatsText(): Promise<string | null> {
    const popoverButton = this.getSummaryStatsField().locator(
      "[data-testid='detail-popover-trigger']"
    );
    const hasPopover = await popoverButton.isVisible().catch(() => false);

    if (hasPopover) {
      return await popoverButton.textContent();
    }

    return await this.getSummaryStatsField().textContent();
  }

  async isSummaryStatsAvailable(): Promise<boolean> {
    const text = await this.getSummaryStatsText();
    return !!text && text.includes("Available") && !text.includes("Not Available");
  }

  async hasSummaryStatsPopover(): Promise<boolean> {
    const button = this.getSummaryStatsField().locator("[data-testid='detail-popover-trigger']");
    return await button.isVisible().catch(() => false);
  }

  async clickSummaryStatsPopover(): Promise<void> {
    const button = this.getSummaryStatsField().locator("[data-testid='detail-popover-trigger']");
    const hasPopover = await button.isVisible().catch(() => false);

    if (hasPopover) {
      await button.click();
    } else {
      throw new Error("Summary statistics popover button not found");
    }
  }

  // QC warnings
  getQCWarningsField(): Locator {
    return this.page.locator("[data-testid='field-qc-warnings']");
  }

  async hasQCWarnings(): Promise<boolean> {
    return await this.getQCWarningsField()
      .isVisible()
      .catch(() => false);
  }

  async clickQCWarnings(): Promise<void> {
    await this.getQCWarningsField().locator("[data-testid='detail-popover-trigger']").click();
  }
}
