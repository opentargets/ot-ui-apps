import type { Locator, Page } from "@playwright/test";

export class SummaryTracksSection {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Section container
  getSection(): Locator {
    return this.page.locator("[data-testid='section-summaryTracks']");
  }

  async isSectionVisible(): Promise<boolean> {
    return await this.getSection().isVisible();
  }

  // Section header
  getSectionHeader(): Locator {
    return this.page.locator("[data-testid='section-summaryTracks-header']");
  }

  async getSectionTitle(): Promise<string | null> {
    return await this.getSectionHeader().textContent();
  }

  // Description
  getDescription(): Locator {
    return this.getSection().locator("[data-testid='section-description']");
  }

  async getDescriptionText(): Promise<string | null> {
    return await this.getDescription()
      .textContent()
      .catch(() => null);
  }

  // Loading state
  getSectionLoader(): Locator {
    return this.getSection().locator("[data-testid='section-loader']");
  }

  async isLoading(): Promise<boolean> {
    return await this.getSectionLoader()
      .isVisible()
      .catch(() => false);
  }

  // Content loading message
  getLoadingMessage(): Locator {
    return this.getSection().getByText("Loading data. This may take some time...");
  }

  async isLoadingMessageVisible(): Promise<boolean> {
    return await this.getLoadingMessage()
      .isVisible()
      .catch(() => false);
  }

  // Body content (BodyContent component)
  getBodyContent(): Locator {
    return this.getSection().locator("[data-testid='body-content']");
  }

  async isBodyContentVisible(): Promise<boolean> {
    return await this.getBodyContent()
      .isVisible()
      .catch(() => false);
  }

  // Table (if present in BodyContent)
  getTable(): Locator {
    return this.getSection().locator("table");
  }

  async isTableVisible(): Promise<boolean> {
    return await this.getTable()
      .isVisible()
      .catch(() => false);
  }

  getTableRows(): Locator {
    return this.getTable().locator("tbody tr");
  }

  async getRowCount(): Promise<number> {
    return await this.getTableRows().count();
  }

  getCell(rowIndex: number, columnIndex: number): Locator {
    return this.getTableRows().nth(rowIndex).locator("td").nth(columnIndex);
  }

  // Wait for section to load
  async waitForSectionLoad(): Promise<void> {
    await this.getSection().waitFor({ state: "visible" });
    // Wait for loading to complete
    await this.page.waitForFunction(
      () => !document.querySelector("[data-testid='section-loader']")?.isConnected,
      { timeout: 30000 }
    ).catch(() => {});
  }

  // Wait for data to load (considering the loading message)
  async waitForDataLoad(): Promise<void> {
    await this.waitForSectionLoad();
    await this.page.waitForFunction(
      () => !document.getByText?.("Loading data. This may take some time...")?.isConnected,
      { timeout: 60000 }
    ).catch(() => {});
  }
}