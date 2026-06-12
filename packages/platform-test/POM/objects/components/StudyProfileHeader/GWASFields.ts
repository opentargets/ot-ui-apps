import type { Locator, Page } from "@playwright/test";

/**
 * Helper class for GWAS-specific profile fields
 */
export class GWASFields {
  constructor(private page: Page) {}

  // Reported trait
  getReportedTraitField(): Locator {
    return this.page.locator("[data-testid='field-reported-trait']");
  }

  async getReportedTrait(): Promise<string | null> {
    return await this.getReportedTraitField().textContent();
  }

  async isReportedTraitVisible(): Promise<boolean> {
    return await this.getReportedTraitField()
      .isVisible()
      .catch(() => false);
  }

  // Disease or phenotype
  getDiseaseField(): Locator {
    return this.page.locator("[data-testid='field-disease-or-phenotype']");
  }

  async getDiseases(): Promise<string[]> {
    const diseaseLinks = this.getDiseaseField().locator("a");
    const count = await diseaseLinks.count();
    const diseases: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = await diseaseLinks.nth(i).textContent();
      if (text) diseases.push(text);
    }

    return diseases;
  }

  async isDiseaseFieldVisible(): Promise<boolean> {
    return await this.getDiseaseField()
      .isVisible()
      .catch(() => false);
  }

  async clickDiseaseLink(index: number = 0): Promise<void> {
    await this.getDiseaseField().locator("a").nth(index).click();
  }

  // Background trait
  getBackgroundTraitField(): Locator {
    return this.page.locator("[data-testid='field-background-trait']");
  }

  async getBackgroundTraits(): Promise<string[]> {
    const traitLinks = this.getBackgroundTraitField().locator("a");
    const count = await traitLinks.count();
    const traits: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = await traitLinks.nth(i).textContent();
      if (text) traits.push(text);
    }

    return traits;
  }

  async isBackgroundTraitVisible(): Promise<boolean> {
    return await this.getBackgroundTraitField()
      .isVisible()
      .catch(() => false);
  }
}
