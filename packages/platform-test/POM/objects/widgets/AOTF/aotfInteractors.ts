import type { Locator, Page } from "@playwright/test";

/**
 * Interactor source types available in the AOTF interactors panel.
 */
export enum InteractorsSource {
  INTACT = "intact",
  REACTOME = "reactome",
  SIGNOR = "signor",
  STRING = "string",
}

/**
 * Interactor for the Target Interactors panel in the AOTF table.
 *
 * The Interactors panel displays target-disease associations for interacting
 * proteins of a selected target. It shows related targets that physically or
 * functionally interact with the selected target. Features include:
 * - **Source selection**: Choose from IntAct, Reactome, Signor, or String databases
 * - **Interaction score threshold**: Filter by interaction confidence (IntAct/String only)
 * - **Pagination**: Navigate through interactor associations
 * - **Summary**: Shows count of associations and interactors found
 *
 * The interactors panel is opened via the context menu on a target row in the
 * associations table by clicking "Target interactors".
 *
 * @example
 * ```typescript
 * const interactors = new AotfInteractors(page);
 *
 * // Open interactors for a target via context menu
 * await aotfTable.getContextMenuForRow(0).click();
 * await page.locator('text=Target interactors').click();
 *
 * // Wait for interactors to load
 * await interactors.waitForInteractorsLoad();
 *
 * // Change source
 * await interactors.selectSource(InteractorsSource.STRING);
 *
 * // Adjust threshold (String/IntAct only)
 * await interactors.setThreshold(0.8);
 *
 * // Get interactor count
 * const count = await interactors.getInteractorRowCount();
 *
 * // Close interactors panel
 * await interactors.closeInteractors();
 * ```
 *
 * @category AOTF
 * @remarks Opens as a sub-panel within a target row in the associations table
 */
export class AotfInteractors {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Container - accepts optional targetId to get specific interactors table
  getInteractorsTable(targetId?: string): Locator {
    if (targetId) {
      return this.page.locator(`[data-testid='interactors-table-${targetId}']`);
    }
    return this.page.locator("[data-testid^='interactors-table-']").first();
  }

  // Header section
  getInteractorsHeader(): Locator {
    return this.page.locator("[data-testid='interactors-header']").first();
  }

  getInteractorsLabel(): Locator {
    return this.page.locator("[data-testid='interactors-label']").first();
  }

  async getInteractorsLabelText(): Promise<string | null> {
    return await this.getInteractorsLabel().textContent();
  }

  // Source selector - MUI NativeSelect renders a combobox
  getSourceSelectWrapper(): Locator {
    return this.page.locator("[data-testid='interactors-source-select']").first();
  }

  getSourceSelect(): Locator {
    // Use role-based locator for the actual combobox element
    return this.page.getByRole("combobox", { name: "Source:" });
  }

  async getSelectedSource(): Promise<string | null> {
    return await this.getSourceSelect().inputValue();
  }

  async selectSource(source: InteractorsSource): Promise<void> {
    await this.getSourceSelect().selectOption(source);
  }

  // Threshold controls (only available for IntAct and String)
  getThresholdSlider(): Locator {
    return this.page.locator("[data-testid='interactors-threshold-slider']").first();
  }

  getThresholdValue(): Locator {
    return this.page.locator("[data-testid='interactors-threshold-value']").first();
  }

  getThresholdUnavailable(): Locator {
    return this.page.locator("[data-testid='interactors-threshold-unavailable']").first();
  }

  async getCurrentThreshold(): Promise<string | null> {
    return await this.getThresholdValue().textContent();
  }

  async isThresholdAvailable(): Promise<boolean> {
    const unavailable = await this.getThresholdUnavailable()
      .isVisible()
      .catch(() => false);
    return !unavailable;
  }

  async setThreshold(value: number): Promise<void> {
    const slider = this.getThresholdSlider();
    // MUI Slider - we need to use the bounding box to calculate click position
    const box = await slider.boundingBox();
    if (box) {
      // Calculate x position based on value (0-1 range)
      const xOffset = box.width * value;
      await slider.click({ position: { x: xOffset, y: box.height / 2 } });
    }
  }

  // Summary/loading
  getLoadingIndicator(): Locator {
    return this.page.locator("[data-testid='interactors-loading']").first();
  }

  getSummary(): Locator {
    return this.page.locator("[data-testid='interactors-summary']").first();
  }

  async isLoading(): Promise<boolean> {
    return await this.getLoadingIndicator()
      .isVisible()
      .catch(() => false);
  }

  async getSummaryText(): Promise<string | null> {
    return await this.getSummary().textContent();
  }

  // Close button
  getCloseButton(): Locator {
    return this.page.locator("[data-testid='interactors-close-button']").first();
  }

  async closeInteractors(): Promise<void> {
    await this.getCloseButton().click();
  }

  // Body/table content
  getInteractorsBody(): Locator {
    return this.page.locator("[data-testid='interactors-body']").first();
  }

  // Interactor rows - uses the interactors prefix
  getInteractorRows(): Locator {
    return this.page.locator("[data-testid^='table-row-interactors-']");
  }

  getInteractorRowByIndex(index: number): Locator {
    return this.page.locator(`[data-testid='table-row-interactors-${index}']`);
  }

  async getInteractorRowCount(): Promise<number> {
    return await this.getInteractorRows().count();
  }

  // Name cell within interactor row
  getInteractorNameCell(rowIndex: number): Locator {
    return this.page.locator(
      `[data-testid='table-row-interactors-${rowIndex}'] [data-testid='name-cell']`
    );
  }

  async getInteractorName(rowIndex: number): Promise<string | null> {
    const nameCell = this.getInteractorNameCell(rowIndex);
    await nameCell.waitFor({ state: "visible" });
    return await nameCell.textContent();
  }

  // Pagination
  getPagination(): Locator {
    return this.page.locator("[data-testid='interactors-pagination']").first();
  }

  getPaginationInfo(): Locator {
    return this.page.locator("[data-testid='interactors-pagination-info']").first();
  }

  getPreviousPageButton(): Locator {
    return this.page.locator("[data-testid='interactors-previous-page']").first();
  }

  getNextPageButton(): Locator {
    return this.page.locator("[data-testid='interactors-next-page']").first();
  }

  async getPaginationText(): Promise<string | null> {
    return await this.getPaginationInfo().textContent();
  }

  async clickNextPage(): Promise<void> {
    await this.getNextPageButton().click();
  }

  async clickPreviousPage(): Promise<void> {
    await this.getPreviousPageButton().click();
  }

  async canGoNextPage(): Promise<boolean> {
    return await this.getNextPageButton().isEnabled();
  }

  async canGoPreviousPage(): Promise<boolean> {
    return await this.getPreviousPageButton().isEnabled();
  }

  // Wait helpers
  async waitForInteractorsLoad(): Promise<void> {
    // Wait for the interactors table container to appear
    await this.page.waitForSelector("[data-testid^='interactors-table-']", { state: "visible" });
    // Wait for loading to finish
    const isLoading = await this.isLoading();
    if (isLoading) {
      await this.getLoadingIndicator().waitFor({ state: "hidden", timeout: 30000 });
    }
    // Give time for content to render
    await this.page.waitForTimeout(500);
  }

  async waitForInteractorsClose(): Promise<void> {
    await this.page.waitForSelector("[data-testid^='interactors-table-']", { state: "hidden" });
  }

  // Check if interactors panel is visible
  async isVisible(): Promise<boolean> {
    return await this.getInteractorsTable()
      .isVisible()
      .catch(() => false);
  }

  // Data cells within interactor rows
  getDataCellsInRow(rowIndex: number): Locator {
    return this.page.locator(
      `[data-testid='table-row-interactors-${rowIndex}'] [data-testid^='score-cell-'][data-score]`
    );
  }

  getDataCell(rowIndex: number, columnId: string): Locator {
    return this.page.locator(
      `[data-testid='table-row-interactors-${rowIndex}'] [data-testid='score-cell-${columnId}']`
    );
  }

  async getDataCellScore(rowIndex: number, columnId: string): Promise<number | null> {
    const cell = this.getDataCell(rowIndex, columnId);
    const score = await cell.getAttribute("data-score");
    return score ? parseFloat(score) : null;
  }

  async clickDataCell(rowIndex: number, columnId: string): Promise<void> {
    const cell = this.getDataCell(rowIndex, columnId);
    await cell.click();
  }

  async getDataCellsWithScores(
    rowIndex: number
  ): Promise<Array<{ columnId: string; score: number }>> {
    const cells = this.getDataCellsInRow(rowIndex);
    const count = await cells.count();
    const cellsWithScores: Array<{ columnId: string; score: number }> = [];

    for (let i = 0; i < count; i++) {
      const cell = cells.nth(i);
      const scoreAttr = await cell.getAttribute("data-score");
      const testId = await cell.getAttribute("data-testid");

      if (scoreAttr && testId) {
        const score = parseFloat(scoreAttr);
        if (score > 0) {
          const columnId = testId.replace("score-cell-", "");
          cellsWithScores.push({ columnId, score });
        }
      }
    }

    return cellsWithScores;
  }

  async findFirstRowWithData(): Promise<number | null> {
    const rowCount = await this.getInteractorRowCount();

    for (let i = 0; i < rowCount; i++) {
      const cellsWithScores = await this.getDataCellsWithScores(i);
      if (cellsWithScores.length > 0) {
        return i;
      }
    }

    return null;
  }
}
