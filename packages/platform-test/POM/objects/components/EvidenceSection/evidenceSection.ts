import type { Locator, Page } from "@playwright/test";

export class EvidenceSection {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Get evidence section by section ID
  getEvidenceSection(sectionId: string): Locator {
    return this.page.locator(`[data-testid='evidence-section-${sectionId}']`);
  }

  // Check if evidence section is visible
  async isEvidenceSectionVisible(sectionId: string): Promise<boolean> {
    return await this.getEvidenceSection(sectionId)
      .isVisible()
      .catch(() => false);
  }

  // Wait for evidence section to appear
  async waitForEvidenceSection(sectionId: string): Promise<void> {
    await this.getEvidenceSection(sectionId).waitFor({ state: "visible", timeout: 5000 });
  }

  // Get all visible evidence sections
  getAllEvidenceSections(): Locator {
    return this.page.locator("[data-testid^='evidence-section-']");
  }

  // Get count of visible evidence sections
  async getEvidenceSectionCount(): Promise<number> {
    return await this.getAllEvidenceSections().count();
  }

  // Check if any evidence section is displayed
  async hasAnyEvidenceSection(): Promise<boolean> {
    const count = await this.getEvidenceSectionCount();
    return count > 0;
  }

  // Close/collapse evidence section (if there's a close button)
  async closeEvidenceSection(sectionId: string): Promise<void> {
    const section = this.getEvidenceSection(sectionId);
    const closeButton = section.locator("button[aria-label='close']").first();
    if (await closeButton.isVisible()) {
      await closeButton.click();
    }
  }

  // Check if loader is present in evidence section
  getLoader(): Locator {
    return this.page.locator("[data-testid='section-loader']");
  }

  async isLoaderVisible(): Promise<boolean> {
    return await this.getLoader()
      .isVisible()
      .catch(() => false);
  }

  async waitForLoaderToDisappear(): Promise<void> {
    try {
      await this.getLoader().waitFor({ state: "hidden", timeout: 10000 });
    } catch {
      // Loader might not appear at all, which is fine
    }
  }

  // Wait for section to fully load (section visible and no loader)
  // Note: There is no error fallback UI - if there's an error, the section simply won't render
  async waitForSectionLoad(sectionId: string): Promise<void> {
    // Wait for section to appear (if this fails, it indicates an error state)
    await this.waitForEvidenceSection(sectionId);

    // Wait for loader to disappear
    await this.waitForLoaderToDisappear();
  }
}
