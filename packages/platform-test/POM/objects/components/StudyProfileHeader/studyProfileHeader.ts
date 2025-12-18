import type { Locator, Page } from "@playwright/test";

export class StudyProfileHeader {
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

  // Study type field
  async getStudyTypeField(): Promise<Locator> {
    const studyText = await this.page.locator("[data-testid='field-study-type']");
    return studyText;
  }

  async getStudyType(): Promise<string | null> {
    const studyTypeField = await this.getStudyTypeField();
    return await studyTypeField.textContent();
  }

  async isStudyTypeVisible(): Promise<boolean> {
    const studyTypeField = await this.getStudyTypeField();
    return await studyTypeField.isVisible().catch(() => false);
  }

  // Reported trait (GWAS only)
  getReportedTraitField(): Locator {
    return this.page.locator("[data-testid='field-reported-trait']");
  }

  async getReportedTrait(): Promise<string | null> {
    const reportedTraitField = await this.getReportedTraitField();
    return await reportedTraitField.textContent();
  }

  async isReportedTraitVisible(): Promise<boolean> {
    return await this.getReportedTraitField()
      .isVisible()
      .catch(() => false);
  }

  // Disease or phenotype field (GWAS only)
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

  // Background trait (GWAS only)
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

  // Project field (QTL only)
  getProjectField(): Locator {
    return this.page.locator("[data-testid='field-project']");
  }

  async getProject(): Promise<string | null> {
    const projectField = await this.getProjectField();
    return await projectField.textContent();
  }

  async isProjectFieldVisible(): Promise<boolean> {
    return await this.getProjectField()
      .isVisible()
      .catch(() => false);
  }

  // Affected gene field (QTL only)
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

  // Affected cell/tissue field (QTL only)
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

  // Condition field (QTL only)
  getConditionField(): Locator {
    return this.page.locator("[data-testid='field-condition']");
  }

  async getCondition(): Promise<string | null> {
    const conditionField = await this.getConditionField();
    return await conditionField.textContent();
  }

  async isConditionVisible(): Promise<boolean> {
    return await this.getConditionField()
      .isVisible()
      .catch(() => false);
  }

  // Publication field
  getPublicationField(): Locator {
    return this.page.locator("[data-testid='field-publication']");
  }

  async getPublication(): Promise<string | null> {
    const publicationField = await this.getPublicationField();
    return await publicationField.textContent();
  }

  async isPublicationVisible(): Promise<boolean> {
    return await this.getPublicationField()
      .isVisible()
      .catch(() => false);
  }

  // PubMed field
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

  // Summary statistics field
  getSummaryStatsField(): Locator {
    return this.page.locator("[data-testid='field-summary-statistics']");
  }

  async getSummaryStatsText(): Promise<string | null> {
    // Check if there's a DetailPopover button (when sumstatQCValues exist)
    const popoverButton = this.getSummaryStatsField().locator(
      "[data-testid='detail-popover-trigger']"
    );
    const hasPopover = await popoverButton.isVisible().catch(() => false);

    if (hasPopover) {
      // Get the button text which will be "Available"
      return await popoverButton.textContent();
    }

    // Otherwise get the direct text content (either "Not Available" or "Available")
    const fieldContent = this.getSummaryStatsField();
    return await fieldContent.textContent();
  }

  async isSummaryStatsAvailable(): Promise<boolean> {
    const text = await this.getSummaryStatsText();
    return text?.includes("Available") && !text?.includes("Not Available");
  }

  async hasSummaryStatsPopover(): Promise<boolean> {
    const button = this.getSummaryStatsField().locator("[data-testid='detail-popover-trigger']");
    return await button.isVisible().catch(() => false);
  }

  async clickSummaryStatsPopover(): Promise<void> {
    const button = this.getSummaryStatsField().locator("[data-testid='detail-popover-trigger']");
    const hasPopover = await button.isVisible().catch(() => false);

    if (hasPopover) {
      await button.click();
    } else {
      throw new Error("Summary statistics popover button not found");
    }
  }

  // QC warnings
  getQCWarningsField(): Locator {
    return this.page.locator("[data-testid='field-qc-warnings']");
  }

  async hasQCWarnings(): Promise<boolean> {
    return await this.getQCWarningsField()
      .isVisible()
      .catch(() => false);
  }

  async clickQCWarnings(): Promise<void> {
    await this.getQCWarningsField().locator("[data-testid='detail-popover-trigger']").click();
  }

  // Sample size field
  getSampleSizeField(): Locator {
    return this.page.locator("[data-testid='field-sample-size']");
  }

  async getSampleSize(): Promise<string | null> {
    const sampleSizeField = await this.getSampleSizeField();
    return await sampleSizeField.textContent();
  }

  async isSampleSizeVisible(): Promise<boolean> {
    const sampleSizeField = await this.getSampleSizeField();
    return await sampleSizeField.isVisible().catch(() => false);
  }

  // N cases field
  getNCasesField(): Locator {
    return this.page.locator("[data-testid='field-n-cases']");
  }

  async getNCases(): Promise<string | null> {
    const nCasesField = await this.getNCasesField();
    return await nCasesField.textContent();
  }

  async isNCasesVisible(): Promise<boolean> {
    return await this.getNCasesField()
      .isVisible()
      .catch(() => false);
  }

  // N controls field
  getNControlsField(): Locator {
    return this.page.locator("[data-testid='field-n-controls']");
  }

  async getNControls(): Promise<string | null> {
    const nControlsField = await this.getNControlsField();
    return await nControlsField.textContent();
  }

  async isNControlsVisible(): Promise<boolean> {
    return await this.getNControlsField()
      .isVisible()
      .catch(() => false);
  }

  // Analysis field
  getAnalysisField(): Locator {
    return this.page.locator("[data-testid='field-analysis']");
  }

  async getAnalysis(): Promise<string | null> {
    const analysisField = await this.getAnalysisField();
    return await analysisField.textContent();
  }

  async isAnalysisVisible(): Promise<boolean> {
    return await this.getAnalysisField()
      .isVisible()
      .catch(() => false);
  }

  // Population chips (LD reference population)
  getPopulationChips(): Locator {
    return this.page.locator("[data-testid^='chip-ld-population-']");
  }

  async getPopulationChipsCount(): Promise<number> {
    return await this.getPopulationChips().count();
  }

  async getPopulationChipLabel(index: number): Promise<string | null> {
    return await this.getPopulationChips()
      .nth(index)
      .locator("[data-testid^='chip-ld-population-']")
      .first()
      .textContent();
  }

  async getPopulationChipValue(index: number): Promise<string | null> {
    return await this.getPopulationChips()
      .nth(index)
      .locator("[data-testid^='chip-ld-population-']")
      .nth(1)
      .textContent();
  }

  async hoverPopulationChip(index: number): Promise<void> {
    await this.getPopulationChips().nth(index).hover();
  }

  // Wait for profile header to load
  async waitForProfileHeaderLoad(): Promise<void> {
    await this.page.waitForSelector("[data-testid='profile-page-header-block']", {
      state: "visible",
    });
    await this.page.waitForTimeout(500);
  }
}
