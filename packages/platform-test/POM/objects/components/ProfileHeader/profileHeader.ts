import type { Locator, Page } from "@playwright/test";

export class ProfileHeader {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Profile header container
  getProfileHeader(): Locator {
    return this.page.locator("[data-testid='profile-header']");
  }

  async isProfileHeaderVisible(): Promise<boolean> {
    return await this.getProfileHeader()
      .isVisible()
      .catch(() => false);
  }

  // Description section
  getDescriptionSection(): Locator {
    return this.page.locator("[data-testid='profile-description']");
  }

  async isDescriptionVisible(): Promise<boolean> {
    return await this.getDescriptionSection()
      .isVisible()
      .catch(() => false);
  }

  async getDescriptionText(): Promise<string | null> {
    return await this.getDescriptionSection().textContent();
  }

  // Synonyms section
  getSynonymsSection(): Locator {
    return this.page.locator("[data-testid='profile-synonyms']");
  }

  async isSynonymsSectionVisible(): Promise<boolean> {
    return await this.getSynonymsSection()
      .isVisible()
      .catch(() => false);
  }

  getSynonymChips(): Locator {
    return this.getSynonymsSection().locator("[data-testid^='chip-']");
  }

  async getSynonymsCount(): Promise<number> {
    return await this.getSynonymChips().count();
  }

  getSynonymChip(index: number): Locator {
    return this.getSynonymChips().nth(index);
  }

  async getSynonymText(index: number): Promise<string | null> {
    return await this.getSynonymChip(index).textContent();
  }

  // Hover to see tooltip
  async hoverSynonymChip(index: number): Promise<void> {
    await this.getSynonymChip(index).hover();
  }

  // Wait for profile header to load
  async waitForProfileHeaderLoad(): Promise<void> {
    await this.page.waitForSelector("[data-testid='profile-header']", { state: "visible" });
    await this.page.waitForTimeout(500);
  }
}
