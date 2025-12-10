import { test } from "@playwright/test";
import { DiseasePage } from "../../POM/page/disease/disease";
import { AotfActions } from "../../POM/objects/widgets/AOTF/aotfActions";

const DISEASE_EFO_ID = "EFO_0000612";
const DISEASE_NAME = "myocardial infarction";

test.describe("Disease Page", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/disease/${DISEASE_EFO_ID}/associations`);
  });

  test.describe("Aotf main actions functionality", () => {
    test("Can search through targets in the disease associations page", async ({ page }) => {
        const aotfActions = new AotfActions(page);
        await aotfActions.searchByName("ADRB1");
        const filterValue = await aotfActions.getNameFilterValue();
        test.expect(filterValue).toBe("ADRB1");
    });
    

    test("Can toggle advance filters", async ({ page }) => {
        const aotfActions = new AotfActions(page);
        await aotfActions.openFacetsSearch();
        const isOpen = await aotfActions.isFacetsPopoverOpen();
        test.expect(isOpen).toBe(true);
    });

    test("Can toggle column options", async ({ page }) => {
        const aotfActions = new AotfActions(page);
        await aotfActions.openColumnOptions();
        const isActive = await aotfActions.isColumnOptionsActive();
        test.expect(isActive).toBe(true);
    });

    test("Can toggle export options", async ({ page }) => {
        const aotfActions = new AotfActions(page);
        await aotfActions.openExportMenu();
        const isActive = await aotfActions.isExportMenuOpen();
        test.expect(isActive).toBe(true);
    });

    test("Can toggle between association and target prioritization options", async ({ page }) => {
        const aotfActions = new AotfActions(page);
        await aotfActions.switchToAssociationsView();
        const currentView = await aotfActions.getCurrentDisplayMode();
        test.expect(currentView).toBe("associations");

        await aotfActions.switchToPrioritisationView();
        const newView = await aotfActions.getCurrentDisplayMode();
        test.expect(newView).toBe("prioritisations");
    });
  });

  test("Disease header is correctly displayed", async ({ page }) => {
    const diseaseName = page.getByTestId("profile-page-header-text");
    await test.expect(diseaseName).toHaveText(DISEASE_NAME);
  });

  test("Can navigate to the profile page from the disease page", async ({ page }) => {
    const diseasePage = new DiseasePage(page);
    await diseasePage.goToProfilePage();

    // Verify that the URL is the profile page URL
    await test.expect(page.url()).toBe(diseasePage.getProfilePage());
  });

  test("External links in header are displayed and working", async ({ page }) => {
    const diseasePage = new DiseasePage(page);

    // Check for EFO external link
    const efoLink = diseasePage.getEfoLink();
    await test.expect(efoLink).toBeVisible();

    // Verify the EFO link has the correct href
    const efoHref = await diseasePage.getEfoLinkHref();
    test.expect(efoHref).toContain(DISEASE_EFO_ID);
    test.expect(efoHref).toContain("ebi.ac.uk/ols4/ontologies/efo/terms");

    // Check for cross-reference links (e.g., MONDO, MeSH, etc.)
    const xrefCount = await diseasePage.getXrefLinksCount();

    // Verify that at least one cross-reference link exists
    test.expect(xrefCount).toBeGreaterThan(0);

    // Verify the first xref link has a valid href
    if (xrefCount > 0) {
      const firstXrefHref = await diseasePage.getFirstXrefLinkHref();
      test.expect(firstXrefHref).toBeTruthy();
      test.expect(firstXrefHref).toMatch(/^https?:\/\//);
    }
  });
});
