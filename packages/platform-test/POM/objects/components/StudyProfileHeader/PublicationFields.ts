import type { Locator, Page } from "@playwright/test";

/**
 * Helper class for publication and metadata fields
 */
export class PublicationFields {
  constructor(private page: Page) {}

  // Publication
  getPublicationField(): Locator {
    return this.page.locator("[data-testid='field-publication']");
  }

  async getPublication(): Promise<string | null> {
    return await this.getPublicationField().textContent();
  }

  async isPublicationVisible(): Promise<boolean> {
    return await this.getPublicationField()
      .isVisible()
      .catch(() => false);
  }

  // PubMed
  getPubMedField(): Locator {
    return this.page.locator("[data-testid='field-pubmed']");
  }

  async getPubMedId(): Promise<string | null> {
    return await this.getPubMedField().textContent();
  }

  async isPubMedVisible(): Promise<boolean> {
    return await this.getPubMedField()
      .isVisible()
      .catch(() => false);
  }

  async clickPubMedLink(): Promise<void> {
    await this.getPubMedField().locator("button").click();
  }
}
