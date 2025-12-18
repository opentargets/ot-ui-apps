import type { Locator, Page } from "@playwright/test";
import { GWASStudiesSection } from "../../objects/widgets/GWAS/gwasStudiesSection"

export class StudyPage {
  page: Page;
  originalURL: string;
  STUDY_BASE_URL = "/study/";
  CHOSEN_STUDY_ID = ""

  constructor(page: Page) {
    this.page = page;
    this.originalURL = page.url();
  }

  /**
   * Navigate to a study page from disease page evidence table
   * @param studyId - The study ID to navigate to
   */
  async goToStudyPageFromEvidence(studyId: string) {
    // Find the study link in evidence tables and click it
    const studyLink = this.page.locator(`a[href*="${this.STUDY_BASE_URL}${studyId}"]`).first();
    await studyLink.click();
    await this.page.waitForURL(`**${this.STUDY_BASE_URL}${studyId}**`);
  }

  /**
   * Navigate directly to a study page
   * @param baseURL - The base URL of the application
   * @param studyId - The study ID to navigate to
   */
  async goToStudyPage(baseURL: string, studyId: string) {
    await this.page.goto(`${baseURL}${this.STUDY_BASE_URL}${studyId}`);
  }

  async goToStudyPageFromGWASWidgetOnDiseasePage(DISEASE_EFO_ID: string) {
    await this.page.goto(`/disease/${DISEASE_EFO_ID}/`);
    const gwasStudiesSection = new GWASStudiesSection(this.page);
    await gwasStudiesSection.getStudyId(0).then(async (studyId) => {
      if (studyId) {
        const trimmedStudyId = studyId.trim();
        this.CHOSEN_STUDY_ID = trimmedStudyId;
        await this.goToStudyPageFromEvidence(trimmedStudyId);
      }
    });

  }

  // Tab navigation
  getProfileTab(): Locator {
    return this.page.locator(`a[href*="${this.STUDY_BASE_URL}"][role="tab"]`).first();
  }

  async isProfileTabActive(): Promise<boolean> {
    const tab = this.getProfileTab();
    const ariaSelected = await tab.getAttribute("aria-selected");
    return ariaSelected === "true";
  }

  async clickProfileTab(): Promise<void> {
    await this.getProfileTab().click();
  }

  // Study page header
  getStudyHeader(): Locator {
    return this.page.locator("[data-testid='profile-page-header']");
  }

  async isStudyHeaderVisible(): Promise<boolean> {
    return await this.getStudyHeader()
      .isVisible()
      .catch(() => false);
  }

  async getStudyIdFromHeader(): Promise<string | null> {
    return await this.page.locator("[data-testid='profile-page-header-text']").textContent();
  }

  // Wait for page load
  async waitForStudyPageLoad(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(500);
  }
}
