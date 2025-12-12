import { test } from "@playwright/test";
import { ProfileHeader } from "../../../POM/objects/components/ProfileHeader/profileHeader";

const DISEASE_EFO_ID = "EFO_0000612";
const DISEASE_NAME = "myocardial infarction";

test.describe("Disease Profile Page", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/disease/${DISEASE_EFO_ID}`);
  });

  test.describe("Profile Header", () => {
    test("Profile header is visible", async ({ page }) => {
      const profileHeader = new ProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      const isVisible = await profileHeader.isProfileHeaderVisible();
      test.expect(isVisible).toBe(true);
    });

    test("Description section is visible and has content", async ({ page }) => {
      const profileHeader = new ProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      const isDescriptionVisible = await profileHeader.isDescriptionVisible();
      test.expect(isDescriptionVisible).toBe(true);

      const descriptionText = await profileHeader.getDescriptionText();
      test.expect(descriptionText).toBeTruthy();
      test.expect(descriptionText?.length).toBeGreaterThan(0);
    });

    test("Synonyms section displays when synonyms exist", async ({ page }) => {
      const profileHeader = new ProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      // Check if synonyms section exists
      const isSynonymsVisible = await profileHeader.isSynonymsSectionVisible();

      // If synonyms are visible, verify they have content
      if (isSynonymsVisible) {
        const synonymsCount = await profileHeader.getSynonymsCount();
        test.expect(synonymsCount).toBeGreaterThan(0);

        // Check first synonym has text
        const firstSynonymText = await profileHeader.getSynonymText(0);
        test.expect(firstSynonymText).toBeTruthy();
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
          test.expect(chipVisible).toBe(true);
        }
      }
    });

    test("Description contains disease-related information", async ({ page }) => {
      const profileHeader = new ProfileHeader(page);
      await profileHeader.waitForProfileHeaderLoad();

      const descriptionText = await profileHeader.getDescriptionText();

      // Check that description is not the default "No description available" message
      if (descriptionText) {
        test.expect(descriptionText.toLowerCase()).not.toContain("no description available");
      }
    });
  });
});
