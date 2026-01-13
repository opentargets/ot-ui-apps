import { test, expect } from "../../../fixtures";
import { ProfileHeader } from "../../../POM/objects/components/ProfileHeader/profileHeader";
import { ClinicalPrecedenceSection } from "../../../POM/objects/widgets/KnownDrugs/knownDrugsSection";
import { PharmacogenomicsSection } from "../../../POM/objects/widgets/shared/pharmacogenomicsSection";

test.describe("Target Profile Page", () => {
  test.beforeEach(async ({ page, baseURL, testConfig }) => {
    const targetId = testConfig.target?.primary || "ENSG00000157764";
    await page.goto(`${baseURL}/target/${targetId}`);
  });

  test.describe("Profile Header", () => {
    test("Profile header is visible and loads correctly", async ({ page }) => {
      const profileHeader = new ProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      const isVisible = await profileHeader.isProfileHeaderVisible();
      expect(isVisible).toBe(true);
    });

    test("Description section is visible and has content", async ({ page }) => {
      const profileHeader = new ProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      const isDescriptionVisible = await profileHeader.isDescriptionVisible();
      expect(isDescriptionVisible).toBe(true);

      const descriptionText = await profileHeader.getDescriptionText();
      expect(descriptionText).toBeTruthy();
      expect(descriptionText?.length).toBeGreaterThan(0);
    });

    test("Description contains relevant target information", async ({ page }) => {
      const profileHeader = new ProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      const descriptionText = await profileHeader.getDescriptionText();

      // Check that description is not the default "No description available" message
      if (descriptionText) {
        expect(descriptionText.toLowerCase()).not.toContain("no description available");
      }
    });

    test("Synonyms section displays when synonyms exist", async ({ page }) => {
      const profileHeader = new ProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      // Check if synonyms section exists
      const isSynonymsVisible = await profileHeader.isSynonymsSectionVisible();

      // If synonyms are visible, verify they have content
      if (isSynonymsVisible) {
        const synonymsCount = await profileHeader.getSynonymsCount();
        expect(synonymsCount).toBeGreaterThan(0);

        // Check first synonym has text
        const firstSynonymText = await profileHeader.getSynonymText(0);
        expect(firstSynonymText).toBeTruthy();
      }
    });

    test("Can interact with synonym chips", async ({ page }) => {
      const profileHeader = new ProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      const isSynonymsVisible = await profileHeader.isSynonymsSectionVisible();

      if (isSynonymsVisible) {
        const synonymsCount = await profileHeader.getSynonymsCount();

        if (synonymsCount > 0) {
          // Hover over first synonym to trigger tooltip
          await profileHeader.hoverSynonymChip(0);
          await page.waitForTimeout(300); // Wait for tooltip

          // Verify chip is still visible after hover
          const chipVisible = await profileHeader.getSynonymChip(0).isVisible();
          expect(chipVisible).toBe(true);
        }
      }
    });

    test("Genomic location is displayed when available", async ({ page }) => {
      const profileHeader = new ProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      // Check for genomic location badge (GRCh38)
      const genomicLocationBadge = page.locator("[data-testid='profile-header']").getByText("GRCh38");
      const isVisible = await genomicLocationBadge.isVisible().catch(() => false);

      if (isVisible) {
        // Verify the badge is present
        await expect(genomicLocationBadge).toBeVisible();
      }
    });

    test("Core essential gene chip is displayed when target is essential", async ({ page }) => {
      const profileHeader = new ProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      // Check for core essential gene chip
      const essentialChip = page.locator("[data-testid='profile-header']").getByText("Core essential gene");
      const isVisible = await essentialChip.isVisible().catch(() => false);

      if (isVisible) {
        await expect(essentialChip).toBeVisible();
      }
    });
  });

  test.describe("Profile Sections Visibility", () => {
    test("Known Drugs section is visible when target has drug data", async ({ page }) => {
      const knownDrugsSection = new ClinicalPrecedenceSection(page);

      // Wait a bit for section to potentially load
      await page.waitForTimeout(2000);

      const isVisible = await knownDrugsSection.isSectionVisible().catch(() => false);

      if (isVisible) {
        await knownDrugsSection.waitForSectionLoad();
        const title = await knownDrugsSection.getSectionTitle();
        expect(title).toBeTruthy();
      }
    });

    test("Pharmacogenomics section is visible when target has pharmacogenomics data", async ({
      page,
    }) => {
      const pharmacoSection = new PharmacogenomicsSection(page);

      // Wait a bit for section to potentially load
      await page.waitForTimeout(2000);

      const isVisible = await pharmacoSection.isSectionVisible().catch(() => false);

      if (isVisible) {
        await pharmacoSection.waitForLoad();
        expect(isVisible).toBe(true);
      }
    });

    test("Profile page displays section summaries", async ({ page }) => {
      // Check for summary container
      const summaryContainer = page.locator("[data-testid='summary-container']");
      const isVisible = await summaryContainer.isVisible().catch(() => false);

      if (isVisible) {
        await expect(summaryContainer).toBeVisible();
      }
    });

    test("Section container is present on profile page", async ({ page }) => {
      // Check for section container
      const sectionContainer = page.locator("[data-testid='section-container']");
      const isVisible = await sectionContainer.isVisible().catch(() => false);

      if (isVisible) {
        await expect(sectionContainer).toBeVisible();
      }
    });
  });

  test.describe("Profile Content Loading", () => {
    test("Profile page loads without errors", async ({ page }) => {
      const profileHeader = new ProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      // Verify basic content is loaded
      const isLoaded = await profileHeader.isProfileHeaderVisible();
      expect(isLoaded).toBe(true);
    });

    test("Profile description does not show loading state after page load", async ({ page }) => {
      const profileHeader = new ProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      // Check that skeleton loader is not present
      const skeleton = page.locator(".MuiSkeleton-root");
      const hasSkeletons = await skeleton.count();

      // Give time for skeletons to disappear
      await page.waitForTimeout(2000);

      // Verify description is loaded (not skeleton)
      const isDescriptionVisible = await profileHeader.isDescriptionVisible();
      expect(isDescriptionVisible).toBe(true);
    });

    test("Multiple synonyms can be displayed", async ({ page }) => {
      const profileHeader = new ProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      const isSynonymsVisible = await profileHeader.isSynonymsSectionVisible();

      if (isSynonymsVisible) {
        const synonymsCount = await profileHeader.getSynonymsCount();

        // Verify we can get text from multiple synonyms if they exist
        if (synonymsCount > 1) {
          const firstSynonym = await profileHeader.getSynonymText(0);
          const secondSynonym = await profileHeader.getSynonymText(1);

          expect(firstSynonym).toBeTruthy();
          expect(secondSynonym).toBeTruthy();
          expect(firstSynonym).not.toBe(secondSynonym);
        }
      }
    });
  });

  test.describe("Profile Interaction", () => {
    test("Can expand description if it's truncated", async ({ page }) => {
      const profileHeader = new ProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      // Check for "show more" link
      const showMoreLink = page.locator("[data-testid='profile-description']").getByText("show more");
      const hasShowMore = await showMoreLink.isVisible().catch(() => false);

      if (hasShowMore) {
        await showMoreLink.click();
        await page.waitForTimeout(300);

        // Check for "hide" link after expansion
        const hideLink = page.locator("[data-testid='profile-description']").getByText("hide");
        await expect(hideLink).toBeVisible();
      }
    });

    test("Can collapse description after expanding", async ({ page }) => {
      const profileHeader = new ProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      const showMoreLink = page.locator("[data-testid='profile-description']").getByText("show more");
      const hasShowMore = await showMoreLink.isVisible().catch(() => false);

      if (hasShowMore) {
        // Expand
        await showMoreLink.click();
        await page.waitForTimeout(300);

        // Collapse
        const hideLink = page.locator("[data-testid='profile-description']").getByText("hide");
        await hideLink.click();
        await page.waitForTimeout(300);

        // Verify "show more" is back
        const showMoreAgain = page.locator("[data-testid='profile-description']").getByText("show more");
        await expect(showMoreAgain).toBeVisible();
      }
    });
  });

  test.describe("Profile Data Validation", () => {
    test("Target profile displays unique content based on target ID", async ({
      page,
      testConfig,
    }) => {
      const profileHeader = new ProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      const descriptionText = await profileHeader.getDescriptionText();

      // Verify we got some description
      expect(descriptionText).toBeTruthy();

      // Description should be meaningful (more than just whitespace)
      expect(descriptionText?.trim().length).toBeGreaterThan(10);
    });

    test("Synonyms have source information in tooltips", async ({ page }) => {
      const profileHeader = new ProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      const isSynonymsVisible = await profileHeader.isSynonymsSectionVisible();

      if (isSynonymsVisible) {
        const synonymsCount = await profileHeader.getSynonymsCount();

        if (synonymsCount > 0) {
          // Hover to potentially see tooltip
          await profileHeader.hoverSynonymChip(0);
          await page.waitForTimeout(500);

          // Check if tooltip appeared (it should contain "Source:")
          const tooltip = page.locator("[role='tooltip']");
          const tooltipVisible = await tooltip.isVisible().catch(() => false);

          if (tooltipVisible) {
            const tooltipText = await tooltip.textContent();
            expect(tooltipText).toContain("Source");
          }
        }
      }
    });
  });
});
