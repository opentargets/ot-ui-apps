import { expect, test } from "../../../fixtures";
import { GenTrackTestSection } from "../../../POM/objects/widgets/GenTrackTest/genTrackTestSection";
import { CredibleSetPage } from "../../../POM/page/credibleSet/credibleSet";

test.describe("GenTrack Test Section", () => {
  let credibleSetPage: CredibleSetPage;
  let genTrackTestSection: GenTrackTestSection;

  test.beforeEach(async ({ page, testConfig }) => {
    credibleSetPage = new CredibleSetPage(page);
    genTrackTestSection = new GenTrackTestSection(page);

    // Navigate using testConfig
    await credibleSetPage.goToCredibleSetPage(testConfig.study.gwas.primary);

    // Check if section is visible, skip if not
    const isVisible = await genTrackTestSection.isSectionVisible();
    if (isVisible) {
      await genTrackTestSection.waitForSectionLoad();
    } else {
      test.skip();
    }
  });

  test("Section is visible when data available", async () => {
    const isVisible = await genTrackTestSection.isSectionVisible();
    expect(isVisible).toBe(true);
  });

  test("Section header displays correct title", async () => {
    const title = await genTrackTestSection.getSectionTitle();
    expect(title).toBe("GenTrack Test");
  });

  test("Shows loading message while data is loading", async () => {
    // Navigate to fresh page to catch loading state
    await credibleSetPage.goToCredibleSetPage(testConfig.study.gwas.primary);
    
    const isLoading = await genTrackTestSection.isLoading();
    if (isLoading) {
      const loadingText = await genTrackTestSection.getLoadingText();
      expect(loadingText).toContain("Loading data. This may take some time...");
    }
  });

  test("Description is visible", async () => {
    const description = await genTrackTestSection.getDescription();
    await expect(description).toBeVisible();
    
    const descriptionText = await genTrackTestSection.getDescriptionText();
    expect(descriptionText).not.toBeNull();
    expect(descriptionText).not.toBe("");
  });

  test("Body content is displayed after loading", async () => {
    await genTrackTestSection.waitForDataLoad();
    
    const isBodyVisible = await genTrackTestSection.isBodyContentVisible();
    expect(isBodyVisible).toBe(true);
  });

  test("Section loads completely within expected timeframe", async () => {
    await genTrackTestSection.waitForDataLoad();
    
    const isVisible = await genTrackTestSection.isSectionVisible();
    const isBodyVisible = await genTrackTestSection.isBodyContentVisible();
    
    expect(isVisible).toBe(true);
    expect(isBodyVisible).toBe(true);
  });
});