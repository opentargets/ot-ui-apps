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
  getTargetOrDiseaseHeader(): Locator {
    return this.page.locator("[data-testid='table-header-name']");
  }

  async getHeaderText(headerTestId: string): Promise<string | null> {
    return await this.page.locator(`[data-testid='${headerTestId}']`).textContent();
  }

  // Table rows and cells
  getTableRows(prefix: string = "core"): Locator {
    return this.page.locator(`[data-testid^='table-row-${prefix}']`);
  }

  async getRowCount(prefix: string = "core"): Promise<number> {
    return await this.getTableRows(prefix).count();
  }

  // Cell accessors
  getNameCell(rowIndex: number, prefix: string = "core"): Locator {
    return this.page.locator(
      `[data-testid='table-row-${prefix}-${rowIndex}'] [data-testid='name-cell']`
    );
  }

  getScoreCell(rowIndex: number, prefix: string = "core"): Locator {
    return this.page.locator(
      `[data-testid='table-row-${prefix}-${rowIndex}'] [data-testid*='score']`
    );
  }

  // Pagination
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

  // Sorting
  async sortByColumn(columnName: string): Promise<void> {
    const header = this.page.getByText(columnName, { exact: true });
    await header.click();
  }

  // Find row index by gene symbol
  async findRowIndexByGeneSymbol(
    geneSymbol: string,
    prefix: string = "core"
  ): Promise<number | null> {
    const rowCount = await this.getRowCount(prefix);

    for (let i = 0; i < rowCount; i++) {
      const nameCell = this.getNameCell(i, prefix);
      const text = await nameCell.textContent();

      if (text?.includes(geneSymbol)) {
        return i;
      }
    }

    return null;
  }

  // Get entity name (target or disease)
  async getEntityName(rowIndex: number, prefix: string = "core"): Promise<string | null> {
    const nameCell = this.getNameCell(rowIndex, prefix);
    // Wait for the name cell to have text content
    await nameCell.waitFor({ state: "visible" });
    const text = await nameCell.textContent();
    return text?.trim() || null;
  }

  // Wait for table to load
  async waitForTableLoad(): Promise<void> {
    await this.page.waitForSelector(".TAssociations", { state: "visible" });
    // Wait for loading to finish if present
    const loadingVisible = await this.page.locator("[data-testid='table-loading']")
      .isVisible()
      .catch(() => false);
    if (loadingVisible) {
      await this.page.locator("[data-testid='table-loading']").waitFor({ state: "hidden" });
    }
    // Wait for at least one row to be present with actual content
    await this.page.waitForSelector("[data-testid^='table-row-core']", { state: "visible" });
    // Give a moment for content to populate
    await this.page.waitForTimeout(500);
  }

  // Get all data cells with scores in a specific row
  getDataCellsInRow(rowIndex: number, prefix: string = "core"): Locator {
    return this.page.locator(
      `[data-testid='table-row-${prefix}-${rowIndex}'] [data-testid^='score-cell-'][data-score]`
    );
  }

  // Get a specific data cell by column id
  getDataCell(rowIndex: number, columnId: string, prefix: string = "core"): Locator {
    return this.page.locator(
      `[data-testid='table-row-${prefix}-${rowIndex}'] [data-testid='score-cell-${columnId}']`
    );
  }

  // Get the score value from a data cell
  async getDataCellScore(
    rowIndex: number,
    columnId: string,
    prefix: string = "core"
  ): Promise<number | null> {
    const cell = this.getDataCell(rowIndex, columnId, prefix);
    const score = await cell.getAttribute("data-score");
    return score ? parseFloat(score) : null;
  }

  // Click on a data cell to open the corresponding section
  async clickDataCell(rowIndex: number, columnId: string, prefix: string = "core"): Promise<void> {
    const cell = this.getDataCell(rowIndex, columnId, prefix);
    await cell.click();
  }

  // Get all data cells with score > 0 in a row
  async getDataCellsWithScores(
    rowIndex: number,
    prefix: string = "core"
  ): Promise<Array<{ columnId: string; score: number }>> {
    const cells = this.getDataCellsInRow(rowIndex, prefix);
    const count = await cells.count();
    const cellsWithScores: Array<{ columnId: string; score: number }> = [];

    for (let i = 0; i < count; i++) {
      const cell = cells.nth(i);
      const scoreAttr = await cell.getAttribute("data-score");
      const testId = await cell.getAttribute("data-testid");

      if (scoreAttr && testId) {
        const score = parseFloat(scoreAttr);
        if (score > 0) {
          // Extract column id from testId: 'score-cell-{columnId}'
          const columnId = testId.replace("score-cell-", "");
          cellsWithScores.push({ columnId, score });
        }
      }
    }

    return cellsWithScores;
  }

  // Find first row with data cells that have score > 0
  async findFirstRowWithData(prefix: string = "core"): Promise<number | null> {
    const rowCount = await this.getRowCount(prefix);

    for (let i = 1; i < rowCount; i++) {
      const cellsWithScores = await this.getDataCellsWithScores(i, prefix);
      if (cellsWithScores.length > 0) {
        return i;
      }
    }

    return null;
  }
}
