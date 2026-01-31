import type { Locator, Page } from "@playwright/test";

export class GenTrackTestSection {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Section container
  getSection(): Locator {
    return this.page.locator("[data-testid='section-genTrackTest']");
  }

  async isSectionVisible(): Promise<boolean> {
    return await this.getSection().isVisible();
  }

  // Section header
  getSectionHeader(): Locator {
    return this.page.locator("[data-testid='section-genTrackTest-header']");
  }

  async getSectionTitle(): Promise<string | null> {
    return await this.getSectionHeader().textContent();
  }

  // Loading state
  getLoadingMessage(): Locator {
    return this.getSection().locator("[data-testid='loading-message']");
  }

  async isLoading(): Promise<boolean> {
    return await this.getLoadingMessage()
      .isVisible()
      .catch(() => false);
  }

  async getLoadingText(): Promise<string | null> {
    return await this.getLoadingMessage().textContent();
  }

  // Description
  getDescription(): Locator {
    return this.getSection().locator("[data-testid='section-description']");
  }

  async getDescriptionText(): Promise<string | null> {
    return await this.getDescription().textContent();
  }

  // Body content
  getBodyContent(): Locator {
    return this.getSection().locator("[data-testid='section-body']");
  }

  async isBodyContentVisible(): Promise<boolean> {
    return await this.getBodyContent()
      .isVisible()
      .catch(() => false);
  }

  // Wait for section to load
  async waitForSectionLoad(): Promise<void> {
    await this.getSection().waitFor({ state: "visible" });
    // Wait for loading to complete if present
    try {
      await this.getLoadingMessage().waitFor({ state: "hidden", timeout: 30000 });
    } catch {
      // Loading message might not be present
    }
  }

  // Wait for data to load completely
  async waitForDataLoad(): Promise<void> {
    await this.waitForSectionLoad();
    await this.getBodyContent().waitFor({ state: "visible" });
  }
}