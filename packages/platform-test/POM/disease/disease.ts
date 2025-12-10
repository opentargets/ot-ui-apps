import type { Locator, Page } from "@playwright/test";

export class DiseasePage {
  page: Page;
  originalURL: string;

  constructor(page: Page) {
    this.page = page;
    this.originalURL = page.url();  
  }

  getProfilePage() {
    return this.page.url().replace(/\/associations$/, "");
  }

  async goToProfilePage() {
    await this.page.goto(this.getProfilePage());
  }
  
  async goToAssociationsPage() {
    await this.page.goto(`${this.originalURL}`);
  }

  // External links methods
  getEfoLink(): Locator {
    return this.page.locator('a[href*="ebi.ac.uk/ols4/ontologies/efo"]');
  }

  async getEfoLinkHref(): Promise<string | null> {
    return await this.getEfoLink().getAttribute("href");
  }

  getXrefLinks(): Locator {
    return this.page.locator('[data-testid="header-external-links"] a[href*="identifiers.org"]');
  }

  async getXrefLinksCount(): Promise<number> {
    return await this.getXrefLinks().count();
  }

  async getFirstXrefLinkHref(): Promise<string | null> {
    return await this.getXrefLinks().first().getAttribute("href");
  }
}
