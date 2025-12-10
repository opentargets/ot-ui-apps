import type { Locator, Page } from "@playwright/test";

export class AotfTable {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Table container
  getTable(): Locator {
    return this.page.locator(".TAssociations");
  }

  // Headers
  getTargetHeader(): Locator {
    return this.page.getByText("Target", { exact: true });
  }

  getDiseaseHeader(): Locator {
    return this.page.getByText("Disease", { exact: true });
  }

  getAssociationScoreHeader(): Locator {
    return this.page.getByText("Association Score", { exact: true });
  }

  // Table rows and cells
  getTableRows(): Locator {
    return this.page.locator("[data-testid^='table-row-']");
  }

  getTableRowByIndex(index: number): Locator {
    return this.page.locator(`[data-testid='table-row-${index}']`);
  }

  async getRowCount(): Promise<number> {
    return await this.getTableRows().count();
  }

  // Cell accessors
  getCellByRowAndColumn(rowIndex: number, columnName: string): Locator {
    return this.page.locator(
      `[data-testid='table-row-${rowIndex}'] [data-testid*='${columnName}']`
    );
  }

  getNameCell(rowIndex: number): Locator {
    return this.page.locator(`[data-testid='table-row-${rowIndex}'] [data-testid*='name-cell']`);
  }

  getScoreCell(rowIndex: number): Locator {
    return this.page.locator(`[data-testid='table-row-${rowIndex}'] [data-testid*='score-cell']`);
  }

  // Pagination
  getPaginationContainer(): Locator {
    return this.page.locator("[data-testid='pagination-container']");
  }

  getPageSizeSelector(): Locator {
    return this.page.locator("[data-testid='page-size-selector']");
  }

  getPreviousPageButton(): Locator {
    return this.page.locator("[data-testid='previous-page-button']");
  }

  getNextPageButton(): Locator {
    return this.page.locator("[data-testid='next-page-button']");
  }

  async clickNextPage(): Promise<void> {
    await this.getNextPageButton().click();
  }

  async clickPreviousPage(): Promise<void> {
    await this.getPreviousPageButton().click();
  }

  async selectPageSize(size: string): Promise<void> {
    await this.getPageSizeSelector().click();
    await this.page.getByRole("option", { name: size }).click();
  }

  // Section controls (Pinned, Uploaded, Core)
  getPinnedSection(): Locator {
    return this.page.locator("text=Pinned").first();
  }

  getUploadedSection(): Locator {
    return this.page.locator("text=Uploaded").first();
  }

  getCoreSection(): Locator {
    return this.page.locator("text=All").first();
  }

  async togglePinnedSection(): Promise<void> {
    await this.getPinnedSection().click();
  }

  async toggleUploadedSection(): Promise<void> {
    await this.getUploadedSection().click();
  }

  async toggleCoreSection(): Promise<void> {
    await this.getCoreSection().click();
  }

  // Delete actions
  getDeletePinnedButton(): Locator {
    return this.page.locator("[data-testid='delete-pinned-button']").first();
  }

  getDeleteUploadedButton(): Locator {
    return this.page.locator("[data-testid='delete-uploaded-button']").first();
  }

  async deletePinnedEntries(): Promise<void> {
    await this.getDeletePinnedButton().click();
  }

  async deleteUploadedEntries(): Promise<void> {
    await this.getDeleteUploadedButton().click();
  }

  // Sorting
  async sortByColumn(columnName: string): Promise<void> {
    const header = this.page.getByText(columnName, { exact: true });
    await header.click();
  }

  // Search/Filter in specific row
  async getRowByName(name: string): Promise<Locator> {
    return this.page.locator(`[data-testid*='table-row']`, { hasText: name });
  }

  // Pin/Unpin row
  getPinButtonForRow(rowIndex: number): Locator {
    return this.page.locator(`[data-testid='pin-button-${rowIndex}']`);
  }

  async pinRow(rowIndex: number): Promise<void> {
    await this.getPinButtonForRow(rowIndex).click();
  }

  // Get association score value
  async getAssociationScoreValue(rowIndex: number): Promise<string | null> {
    const scoreCell = this.getScoreCell(rowIndex);
    return await scoreCell.textContent();
  }

  // Get entity name (target or disease)
  async getEntityName(rowIndex: number): Promise<string | null> {
    const nameCell = this.getNameCell(rowIndex);
    return await nameCell.textContent();
  }

  // Check if table is loading
  getLoadingIndicator(): Locator {
    return this.page.locator("[data-testid='table-loading']");
  }

  async isLoading(): Promise<boolean> {
    return await this.getLoadingIndicator().isVisible();
  }

  // Wait for table to load
  async waitForTableLoad(): Promise<void> {
    await this.page.waitForSelector(".TAssociations", { state: "visible" });
    // Wait for loading to finish if present
    const loadingVisible = await this.getLoadingIndicator()
      .isVisible()
      .catch(() => false);
    if (loadingVisible) {
      await this.getLoadingIndicator().waitFor({ state: "hidden" });
    }
  }
}
