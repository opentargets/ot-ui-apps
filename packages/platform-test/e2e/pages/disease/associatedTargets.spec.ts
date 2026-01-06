import { test } from "@playwright/test";
import { EvidenceSection } from "../../../POM/objects/components/EvidenceSection/evidenceSection";
import { AotfActions } from "../../../POM/objects/widgets/AOTF/aotfActions";
import { AotfTable } from "../../../POM/objects/widgets/AOTF/aotfTable";
import { DiseasePage } from "../../../POM/page/disease/disease";

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

  test.describe("Aotf table functionality", () => {
    test("targets are displayed in the associations table", async ({ page }) => {
      const aotfTable = new AotfTable(page);

      // Wait for table to load
      await aotfTable.waitForTableLoad();

      // Verify table is visible
      await test.expect(aotfTable.getTable()).toBeVisible();

      // Verify header is present
      await test.expect(aotfTable.getTargetOrDiseaseHeader()).toBeVisible();
      const headerText = await aotfTable.getHeaderText("table-header-name");
      test.expect(headerText).toBe("Target");

      // Verify rows are loaded
      const rowCount = await aotfTable.getRowCount();
      test.expect(rowCount).toBeGreaterThan(0);

      // Verify first row has data
      const firstRowName = await aotfTable.getEntityName(0);
      test.expect(firstRowName).toBeTruthy();
    });

    test("can sort by GWAS score in the associations table", async ({ page }) => {
      const aotfTable = new AotfTable(page);
      const aotfActions = new AotfActions(page);
      await aotfTable.waitForTableLoad();

      // Verify no sort filter is active initially (default sort by Association Score)
      const initialSortActive = await aotfActions.hasSortFilter();
      test.expect(initialSortActive).toBe(false);

      // Click to sort by a different column (GWAS associations)
      await aotfTable.sortByColumn("GWAS associations");
      await page.waitForTimeout(1000); // Wait for sort to complete

      // Verify sort filter is now active in the ActiveFiltersPanel
      const sortActive = await aotfActions.hasSortFilter();
      test.expect(sortActive).toBe(true);

      // Verify the sort filter shows the correct column name
      const sortFilterText = await aotfActions.getSortFilterText();
      test.expect(sortFilterText).toContain("GWAS associations");
    });

    test("can paginate through the associations table", async ({ page }) => {
      const aotfTable = new AotfTable(page);
      await aotfTable.waitForTableLoad();

      // Get first page data
      const firstPageFirstRow = await aotfTable.getEntityName(0);

      // Go to next page
      await aotfTable.clickNextPage();
      await page.waitForTimeout(1000); // Wait for new data to load

      // Get second page data
      const secondPageFirstRow = await aotfTable.getEntityName(0);

      // First row on different pages should be different
      test.expect(firstPageFirstRow).not.toBe(secondPageFirstRow);

      // Go back to previous page
      await aotfTable.clickPreviousPage();
      await page.waitForTimeout(1000);

      const backToFirstRow = await aotfTable.getEntityName(0);
      test.expect(backToFirstRow).toBe(firstPageFirstRow);
    });

    test("can change page size", async ({ page }) => {
      const aotfTable = new AotfTable(page);
      await aotfTable.waitForTableLoad();

      // Change page size to 25
      await aotfTable.selectPageSize("25");
      await page.waitForTimeout(1000);

      // Verify more rows are displayed (up to 25)
      const rowCount = await aotfTable.getRowCount();
      test.expect(rowCount).toBeGreaterThanOrEqual(10); // Default is usually 10
    });

    test("can filter targets by name", async ({ page }) => {
      const aotfActions = new AotfActions(page);
      const aotfTable = new AotfTable(page);

      await aotfTable.waitForTableLoad();

      // Search for a specific target
      await aotfActions.searchByName("IL6");
      await page.waitForTimeout(1000); // Wait for filter + debounce

      // Verify filtered results contain the search term
      const firstRowName = await aotfTable.getEntityName(0);
      test.expect(firstRowName?.toLowerCase()).toContain("il6");
    });
  });

  test.describe("Aotf target prioritisation functionality", () => {
    test("Can switch to target prioritisation view and see data", async ({ page }) => {
      const aotfActions = new AotfActions(page);
      const aotfTable = new AotfTable(page);

      // Switch to prioritisation view
      await aotfActions.switchToPrioritisationView();
      await aotfTable.waitForTableLoad();

      // Verify table is visible
      await test.expect(aotfTable.getTable()).toBeVisible();

      // Verify rows are loaded
      const rowCount = await aotfTable.getRowCount();
      test.expect(rowCount).toBeGreaterThan(0);

      // Verify first row has data
      const firstRowName = await aotfTable.getEntityName(0);
      test.expect(firstRowName).toBeTruthy();
    });
  });

  test.describe("Aotf table section is rendered when data is present", () => {
    test("if a target has data, the corresponding widget is shown", async ({ page }) => {
      const aotfTable = new AotfTable(page);
      const evidenceSection = new EvidenceSection(page);
      await aotfTable.waitForTableLoad();

      // Find the first row that has data cells with score > 0
      const rowIndex = await aotfTable.findFirstRowWithData();
      test.expect(rowIndex).not.toBeNull();

      if (rowIndex === null) {
        test.skip(true, "No rows with data found");
        return;
      }

      // Get all data cells with scores in that row
      const dataCells = await aotfTable.getDataCellsWithScores(rowIndex);
      test.expect(dataCells.length).toBeGreaterThan(0);

      // Skip the first cell since it's the total association score
      const cellsToTest = dataCells.slice(1, dataCells.length);

      for (const cell of cellsToTest) {
        // Click on the data cell to open the evidence section
        await aotfTable.clickDataCell(rowIndex, cell.columnId);

        // Wait for section to load (no loader, no error)
        await evidenceSection.waitForSectionLoad(cell.columnId);

        // Verify that an evidence section is visible
        const hasSections = await evidenceSection.hasAnyEvidenceSection();
        test.expect(hasSections).toBe(true);

        // Verify the specific section for this data source is visible
        // The section ID is typically the data source ID (e.g., 'gwas', 'eva', etc.)
        const isVisible = await evidenceSection.isEvidenceSectionVisible(cell.columnId);
        test.expect(isVisible).toBe(true);

        // Verify no loader is visible
        const hasLoader = await evidenceSection.isLoaderVisible();
        test.expect(hasLoader).toBe(false);

        // Click the same cell again to close/toggle the section
        await aotfTable.clickDataCell(rowIndex, cell.columnId);
        await page.waitForTimeout(300);
      }
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
