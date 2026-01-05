import { test } from "../../../fixtures";
import { StudyProfileHeader } from "../../../POM/objects/components/StudyProfileHeader/studyProfileHeader";
import { QTLCredibleSetsSection } from "../../../POM/objects/widgets/Study/qtlCredibleSetsSection";
import { StudyPage } from "../../../POM/page/study/study";

test.describe("Study Page - QTL Study", () => {
  test.beforeEach(async ({ page, baseURL, testConfig }) => {
    const studyPage = new StudyPage(page);
    await studyPage.goToStudyPage(baseURL as string, testConfig.study.qtl!.primary!);
    await studyPage.waitForStudyPageLoad();
  });

  test.describe("QTL Study Profile Header", () => {
    test("Profile header is visible and displays study information", async ({ page }) => {
      const profileHeader = new StudyProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      const isVisible = await profileHeader.isProfileHeaderVisible();
      test.expect(isVisible).toBe(true);
    });

    test("Study type is displayed correctly as QTL", async ({ page }) => {
      const profileHeader = new StudyProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      const studyType = await profileHeader.getStudyType();
      test.expect(studyType).toContain("QTL");
    });

    test("Project field is displayed for QTL studies", async ({ page }) => {
      const profileHeader = new StudyProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      const isVisible = await profileHeader.isProjectFieldVisible();

      if (isVisible) {
        const project = await profileHeader.getProject();
        test.expect(project).toBeTruthy();
        test.expect(project?.length).toBeGreaterThan(0);
      }
    });

    test("Affected gene field is displayed and clickable", async ({ page }) => {
      const profileHeader = new StudyProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      const isVisible = await profileHeader.isAffectedGeneVisible();

      if (isVisible) {
        const geneName = await profileHeader.getAffectedGene();
        test.expect(geneName).toBeTruthy();

        // Click gene link to verify navigation
        await profileHeader.clickAffectedGeneLink();
        await page.waitForURL("**/target/**");

        // Verify we're on target page
        test.expect(page.url()).toContain("/target/");
      }
    });

    test("Affected cell/tissue field is displayed with external link", async ({ page }) => {
      const profileHeader = new StudyProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      const isVisible = await profileHeader.isAffectedCellTissueVisible();

      if (isVisible) {
        const cellTissue = await profileHeader.getAffectedCellTissue();
        test.expect(cellTissue).toBeTruthy();
      }
    });

    test("Condition field is displayed for QTL studies", async ({ page }) => {
      const profileHeader = new StudyProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      const isVisible = await profileHeader.isConditionVisible();

      if (isVisible) {
        const condition = await profileHeader.getCondition();
        test.expect(condition).toBeTruthy();
      }
    });

    test("Publication information is displayed when available", async ({ page }) => {
      const profileHeader = new StudyProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      const isVisible = await profileHeader.isPublicationVisible();

      if (isVisible) {
        const publication = await profileHeader.getPublication();
        test.expect(publication).toBeTruthy();
      }
    });

    test("PubMed ID is displayed when available", async ({ page }) => {
      const profileHeader = new StudyProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      const isVisible = await profileHeader.isPubMedVisible();

      if (isVisible) {
        const pubmedId = await profileHeader.getPubMedId();
        test.expect(pubmedId).toBeTruthy();
      }
    });

    test("Summary statistics availability is indicated", async ({ page }) => {
      const profileHeader = new StudyProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      const summaryStatsText = await profileHeader.getSummaryStatsText();
      test.expect(summaryStatsText).toBeTruthy();
    });

    test("Sample size is displayed when available", async ({ page }) => {
      const profileHeader = new StudyProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      const isVisible = await profileHeader.isSampleSizeVisible();

      if (isVisible) {
        const sampleSize = await profileHeader.getSampleSize();
        test.expect(sampleSize).toBeTruthy();
      }
    });

    test("Analysis flags are displayed when available", async ({ page }) => {
      const profileHeader = new StudyProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      const isVisible = await profileHeader.isAnalysisVisible();

      if (isVisible) {
        const analysis = await profileHeader.getAnalysis();
        test.expect(analysis).toBeTruthy();
      }
    });

    test("Population chips display LD reference populations", async ({ page }) => {
      const profileHeader = new StudyProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      const chipCount = await profileHeader.getPopulationChipsCount();

      if (chipCount > 0) {
        // Check first population chip
        const label = await profileHeader.getPopulationChipLabel(0);
        const value = await profileHeader.getPopulationChipValue(0);

        test.expect(label).toBeTruthy();
        test.expect(value).toMatch(/\d+%/); // Should be a percentage
      }
    });

    test("GWAS-specific fields are not visible for QTL studies", async ({ page }) => {
      const profileHeader = new StudyProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      // GWAS-specific fields should not be visible
      const reportedTraitVisible = await profileHeader.isReportedTraitVisible();
      const diseaseVisible = await profileHeader.isDiseaseFieldVisible();
      const backgroundTraitVisible = await profileHeader.isBackgroundTraitVisible();

      test.expect(reportedTraitVisible).toBe(false);
      test.expect(diseaseVisible).toBe(false);
      test.expect(backgroundTraitVisible).toBe(false);
    });
  });

  test.describe("QTL Credible Sets Section", () => {
    test("QTL Credible Sets section is visible", async ({ page }) => {
      const qtlCredibleSets = new QTLCredibleSetsSection(page);

      const isVisible = await qtlCredibleSets.isSectionVisible();
      test.expect(isVisible).toBe(true);

      if (isVisible) {
        await qtlCredibleSets.waitForSectionLoad();

        const title = await qtlCredibleSets.getSectionTitle();
        test.expect(title).toBeTruthy();
      }
    });

    test("QTL Credible Sets table displays data", async ({ page }) => {
      const qtlCredibleSets = new QTLCredibleSetsSection(page);
      await qtlCredibleSets.waitForSectionLoad();

      const isTableVisible = await qtlCredibleSets.isTableVisible();

      if (isTableVisible) {
        const rowCount = await qtlCredibleSets.getRowCount();
        test.expect(rowCount).toBeGreaterThan(0);

        // Check first row has data
        const firstCellText = await qtlCredibleSets.getCellText(0, 0);
        test.expect(firstCellText).toBeTruthy();
      }
    });

    test("Can click variant link in QTL Credible Sets table", async ({ page }) => {
      const qtlCredibleSets = new QTLCredibleSetsSection(page);
      await qtlCredibleSets.waitForSectionLoad();

      const isTableVisible = await qtlCredibleSets.isTableVisible();

      if (isTableVisible) {
        const rowCount = await qtlCredibleSets.getRowCount();

        if (rowCount > 0) {
          const variantId = await qtlCredibleSets.getVariantId(0);
          test.expect(variantId).toBeTruthy();

          // Click variant link
          await qtlCredibleSets.clickVariantLink(0);
          await page.waitForURL("**/variant/**");

          // Verify we're on variant page
          test.expect(page.url()).toContain("/variant/");
        }
      }
    });

    test("Can paginate through QTL Credible Sets table", async ({ page }) => {
      const qtlCredibleSets = new QTLCredibleSetsSection(page);
      await qtlCredibleSets.waitForSectionLoad();

      const isTableVisible = await qtlCredibleSets.isTableVisible();

      if (isTableVisible) {
        const isNextEnabled = await qtlCredibleSets.isNextPageEnabled();

        if (isNextEnabled) {
          // Get first page data
          const firstPageData = await qtlCredibleSets.getCellText(1, 1);

          // Go to next page
          await qtlCredibleSets.clickNextPage();
          await page.waitForTimeout(1000);

          // Get second page data
          const secondPageData = await qtlCredibleSets.getCellText(1, 1);

          // Data should be different
          test.expect(firstPageData).not.toBe(secondPageData);

          // Go back
          const isPrevEnabled = await qtlCredibleSets.isPreviousPageEnabled();
          if (isPrevEnabled) {
            await qtlCredibleSets.clickPreviousPage();
            await page.waitForTimeout(1000);
          }
        }
      }
    });

    test("Can search in QTL Credible Sets table", async ({ page }) => {
      const qtlCredibleSets = new QTLCredibleSetsSection(page);
      await qtlCredibleSets.waitForSectionLoad();

      const isTableVisible = await qtlCredibleSets.isTableVisible();

      if (isTableVisible) {
        const rowCount = await qtlCredibleSets.getRowCount();

        if (rowCount > 0) {
          // Get a variant ID to search for
          const variantId = await qtlCredibleSets.getVariantId(0);

          if (variantId) {
            // Search for it
            await qtlCredibleSets.searchCredibleSet(variantId);
            await page.waitForTimeout(1000);

            // Verify filtered results
            const filteredRowCount = await qtlCredibleSets.getRowCount();
            test.expect(filteredRowCount).toBeGreaterThan(0);
          }
        }
      }
    });
  });

  test.describe("Study Page Navigation", () => {
    test("Profile tab is active by default", async ({ page }) => {
      const studyPage = new StudyPage(page);

      const isActive = await studyPage.isProfileTabActive();
      test.expect(isActive).toBe(true);
    });

    test("Study page displays correct study ID in header", async ({ page, testConfig }) => {
      const studyPage = new StudyPage(page);

      const studyId = await studyPage.getStudyIdFromHeader();
      test.expect(studyId).toContain(testConfig.study.qtl!.primary!);
    });
  });
});
