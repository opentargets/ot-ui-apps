import type { Locator, Page } from "@playwright/test";

/**
 * Interactor for Variant Profile Header component
 */
export class VariantProfileHeader {
  constructor(private page: Page) {}

  // Profile header container
  getProfileHeader(): Locator {
    return this.page.locator("[data-testid='profile-header']");
  }

  async isProfileHeaderVisible(): Promise<boolean> {
    return await this.getProfileHeader()
      .isVisible()
      .catch(() => false);
  }

  // Variant description
  getVariantDescriptionField(): Locator {
    return this.page.locator("[data-testid='profile-description']");
  }

  async getVariantDescription(): Promise<string | null> {
    return await this.getVariantDescriptionField().textContent();
  }

  async isVariantDescriptionVisible(): Promise<boolean> {
    return await this.getVariantDescriptionField()
      .isVisible()
      .catch(() => false);
  }

  // GRCh38 location
  getGRCh38LocationField(): Locator {
    return this.page.locator("[data-testid='field-grch38-location']");
  }

  async getGRCh38Location(): Promise<string | null> {
    return await this.getGRCh38LocationField().textContent();
  }

  async isGRCh38LocationVisible(): Promise<boolean> {
    return await this.getGRCh38LocationField()
      .isVisible()
      .catch(() => false);
  }

  // Reference allele
  getReferenceAlleleField(): Locator {
    return this.page.locator("[data-testid='field-reference-allele']");
  }

  async getReferenceAllele(): Promise<string | null> {
    return await this.getReferenceAlleleField().textContent();
  }

  async isReferenceAlleleVisible(): Promise<boolean> {
    return await this.getReferenceAlleleField()
      .isVisible()
      .catch(() => false);
  }

  // Alternative allele
  getAlternativeAlleleField(): Locator {
    return this.page.locator("[data-testid='field-alternative-allele']");
  }

  async getAlternativeAllele(): Promise<string | null> {
    return await this.getAlternativeAlleleField().textContent();
  }

  async isAlternativeAlleleVisible(): Promise<boolean> {
    return await this.getAlternativeAlleleField()
      .isVisible()
      .catch(() => false);
  }

  // Most severe consequence
  getMostSevereConsequenceField(): Locator {
    return this.page.locator("[data-testid='field-most-severe-consequence']");
  }

  async getMostSevereConsequence(): Promise<string | null> {
    const link = this.getMostSevereConsequenceField().locator("a");
    return await link.textContent();
  }

  async isMostSevereConsequenceVisible(): Promise<boolean> {
    return await this.getMostSevereConsequenceField()
      .isVisible()
      .catch(() => false);
  }

  async clickMostSevereConsequenceLink(): Promise<void> {
    await this.getMostSevereConsequenceField().locator("a").click();
  }

  // Allele frequencies section
  getAlleleFrequenciesSection(): Locator {
    return this.page.locator("[data-testid='allele-frequencies-section']");
  }

  async hasAlleleFrequencies(): Promise<boolean> {
    return await this.getAlleleFrequenciesSection()
      .isVisible()
      .catch(() => false);
  }

  async getAlleleFrequencyBars(): Promise<number> {
    const section = this.getAlleleFrequenciesSection();
    const bars = section.locator("[data-testid='allele-frequency-bar']");
    return await bars.count();
  }

  // Wait for profile header to load
  async waitForProfileHeaderLoad(): Promise<void> {
    await this.page.waitForSelector("[data-testid='profile-page-header-block']", {
      state: "visible",
    });
    await this.page.waitForTimeout(500);
  }
}
