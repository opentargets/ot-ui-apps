import type { Locator, Page } from "@playwright/test";

export class DiseasePage {
  page: Page;
  originalURL: string;

  constructor(page: Page) {
    this.page = page;
    this.originalURL = page.url();
  }

  getProfilePage() {
    return this.originalURL.replace(/\/associations$/, "");
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
    return this.page.locator('[data-testid^="header-external-links-"] a');
  }

  async getXrefLinksCount(): Promise<number> {
    return await this.getXrefLinks().count();
  }

  async getFirstXrefLinkHref(): Promise<string | null> {
    return await this.getXrefLinks().first().getAttribute("href");
  }

  // Navigate to study page from evidence table
  getStudyLinkInEvidence(studyId: string): Locator {
    return this.page.locator(`a[href*="/study/${studyId}"]`).first();
  }

  async goToStudyPageFromEvidence(studyId: string): Promise<void> {
    await this.getStudyLinkInEvidence(studyId).click();
    await this.page.waitForURL(`**/study/${studyId}**`);
  }

  async getFirstStudyLinkInEvidence(): Promise<Locator> {
    return this.page.locator('a[href*="/study/"]').first();
  }

  async clickFirstStudyInEvidence(): Promise<void> {
    const firstStudyLink = await this.getFirstStudyLinkInEvidence();
    await firstStudyLink.click();
    await this.page.waitForLoadState("networkidle");
  }
}
