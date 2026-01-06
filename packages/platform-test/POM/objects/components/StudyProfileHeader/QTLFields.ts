import type { Locator, Page } from "@playwright/test";

/**
 * Helper class for QTL-specific profile fields
 */
export class QTLFields {
  constructor(private page: Page) {}

  // Project
  getProjectField(): Locator {
    return this.page.locator("[data-testid='field-project']");
  }

  async getProject(): Promise<string | null> {
    return await this.getProjectField().textContent();
  }

  async isProjectFieldVisible(): Promise<boolean> {
    return await this.getProjectField()
      .isVisible()
      .catch(() => false);
  }

  // Affected gene
  getAffectedGeneField(): Locator {
    return this.page.locator("[data-testid='field-affected-gene']");
  }

  async getAffectedGene(): Promise<string | null> {
    const link = this.getAffectedGeneField().locator("a");
    return await link.textContent();
  }

  async isAffectedGeneVisible(): Promise<boolean> {
    return await this.getAffectedGeneField()
      .isVisible()
      .catch(() => false);
  }

  async clickAffectedGeneLink(): Promise<void> {
    await this.getAffectedGeneField().locator("a").click();
  }

  // Affected cell/tissue
  getAffectedCellTissueField(): Locator {
    return this.page.locator("[data-testid='field-affected-cell-tissue']");
  }

  async getAffectedCellTissue(): Promise<string | null> {
    const link = this.getAffectedCellTissueField().locator("a");
    return await link.textContent();
  }

  async isAffectedCellTissueVisible(): Promise<boolean> {
    return await this.getAffectedCellTissueField()
      .isVisible()
      .catch(() => false);
  }

  // Condition
  getConditionField(): Locator {
    return this.page.locator("[data-testid='field-condition']");
  }

  async getCondition(): Promise<string | null> {
    return await this.getConditionField().textContent();
  }

  async isConditionVisible(): Promise<boolean> {
    return await this.getConditionField()
      .isVisible()
      .catch(() => false);
  }
}
