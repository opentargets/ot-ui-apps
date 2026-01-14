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

  // Description section - locate by the "Description" heading
  // Note: Description heading is outside the profile-header container, so search at page level
  getDescriptionHeading(): Locator {
    return this.page.getByRole("heading", { name: "Description", level: 6 });
  }

  getDescriptionSection(): Locator {
    // Get the parent container that includes both heading and description text
    return this.getDescriptionHeading().locator("..");
  }

  async isDescriptionVisible(): Promise<boolean> {
    return await this.getDescriptionHeading()
      .isVisible()
      .catch(() => false);
  }

  async getDescriptionText(): Promise<string | null> {
    // Get the paragraph element that is a sibling following the Description heading
    // Use xpath to find the paragraph sibling after the heading
    const descriptionParagraph = this.getDescriptionHeading().locator(
      "xpath=following-sibling::p[1]"
    );
    return await descriptionParagraph.textContent();
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
