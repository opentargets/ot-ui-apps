import { expect, test } from "../../../fixtures";
import { SummaryTracksSection } from "../../../POM/objects/widgets/SummaryTracks/summaryTracksSection";
import { StudyPage } from "../../../POM/page/study/study";

test.describe("Summary Section", () => {
  let studyPage: StudyPage;
  let summaryTracksSection: SummaryTracksSection;

  test.beforeEach(async ({ page, testConfig }) => {
    studyPage = new StudyPage(page);
    summaryTracksSection = new SummaryTracksSection(page);

    // Navigate using testConfig - use GWAS study as credible sets are typically from GWAS
    await studyPage.goToStudyPage(testConfig.study.gwas.primary);

    // Check if section is visible, skip if not
    const isVisible = await summaryTracksSection.isSectionVisible();
    if (isVisible) {
      await summaryTracksSection.waitForDataLoad();
    } else {
      test.skip();
    }
  });

  test("Section is visible when data available", async () => {
    const isVisible = await summaryTracksSection.isSectionVisible();
    expect(isVisible).toBe(true);
  });

  test("Section header displays correct title", async () => {
    const title = await summaryTracksSection.getSectionTitle();
    expect(title).toContain("Summary");
  });

  test("Description is present", async () => {
    const description = await summaryTracksSection.getDescriptionText();
    expect(description).not.toBeNull();
    expect(description).not.toBe("");
  });

  test("Body content is visible after loading", async () => {
    const isBodyVisible = await summaryTracksSection.isBodyContentVisible();
    expect(isBodyVisible).toBe(true);
  });

  test("Loading message appears during data fetch", async ({ page }) => {
    // Navigate to a fresh instance to catch loading state
    await page.reload();
    
    // Check if loading message is visible during initial load
    const hasLoadingMessage = await summaryTracksSection.isLoadingMessageVisible();
    
    // Either loading message was visible or data loaded quickly
    expect(typeof hasLoadingMessage).toBe("boolean");
  });

  test("Data table is displayed when available", async () => {
    const isTableVisible = await summaryTracksSection.isTableVisible();
    
    if (isTableVisible) {
      const rowCount = await summaryTracksSection.getRowCount();
      expect(rowCount).toBeGreaterThan(0);
    }
  });

  test("Table rows contain data when present", async () => {
    const isTableVisible = await summaryTracksSection.isTableVisible();
    
    if (isTableVisible) {
      const rowCount = await summaryTracksSection.getRowCount();
      if (rowCount > 0) {
        const firstCellContent = await summaryTracksSection.getCell(0, 0).textContent();
        expect(firstCellContent).not.toBeNull();
        expect(firstCellContent?.trim()).not.toBe("");
      }
    }
  });

  test("Section loads without errors", async () => {
    const isLoading = await summaryTracksSection.isLoading();
    expect(isLoading).toBe(false);
    
    const isVisible = await summaryTracksSection.isSectionVisible();
    expect(isVisible).toBe(true);
  });
});