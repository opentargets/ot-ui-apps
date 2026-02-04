import { test } from "../../../fixtures";
import { EvidenceSection } from "../../../POM/objects/components/EvidenceSection/evidenceSection";
import { AotfActions } from "../../../POM/objects/widgets/AOTF/aotfActions";
import {
  AotfInteractors,
  InteractorsSource,
} from "../../../POM/objects/widgets/AOTF/aotfInteractors";
import { AotfTable } from "../../../POM/objects/widgets/AOTF/aotfTable";

test.describe("Disease Page - AOTF Table", () => {
  test.beforeEach(async ({ page, baseURL, testConfig }) => {
    await page.goto(`${baseURL}/disease/${testConfig.disease.primary}/associations`);
  });

  test("targets are displayed in the associations table", { tag: "@smoke" }, async ({ page }) => {
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

test.describe("Disease Page - Target Interactors", () => {
  test.beforeEach(async ({ page, baseURL, testConfig }) => {
    if (!testConfig.disease.primary) {
      test.skip();
    }
    await page.goto(`${baseURL}/disease/${testConfig.disease.primary}/associations`);
  });

  test("can open target interactors panel from context menu", async ({ page }) => {
    const aotfTable = new AotfTable(page);
    const aotfInteractors = new AotfInteractors(page);

    await aotfTable.waitForTableLoad();

    // Open context menu and click on target interactors
    await aotfTable.getContextMenuForRow(0).click();
    await page.locator("text=Target interactors").click();

    // Wait for interactors to load
    await aotfInteractors.waitForInteractorsLoad();

    // Verify interactors panel is visible
    await test.expect(aotfInteractors.getInteractorsTable()).toBeVisible();

    // Verify the label contains the expected text
    const labelText = await aotfInteractors.getInteractorsLabelText();
    test.expect(labelText).toContain("Interactors for");
  });

  test("can change interactors source", async ({ page }) => {
    const aotfTable = new AotfTable(page);
    const aotfInteractors = new AotfInteractors(page);

    await aotfTable.waitForTableLoad();

    // Open interactors for first row
    await aotfTable.getContextMenuForRow(0).click();
    await page.locator("text=Target interactors").click();
    await aotfInteractors.waitForInteractorsLoad();

    // Check default source (should be IntAct)
    const initialSource = await aotfInteractors.getSelectedSource();
    test.expect(initialSource).toBe(InteractorsSource.INTACT);

    // Change to String source
    await aotfInteractors.selectSource(InteractorsSource.STRING);
    await page.waitForTimeout(1000); // Wait for data to reload

    // Verify source changed
    const newSource = await aotfInteractors.getSelectedSource();
    test.expect(newSource).toBe(InteractorsSource.STRING);

    // Change to Reactome
    await aotfInteractors.selectSource(InteractorsSource.REACTOME);
    await page.waitForTimeout(1000);

    // Verify threshold slider is not available for Reactome
    const thresholdAvailable = await aotfInteractors.isThresholdAvailable();
    test.expect(thresholdAvailable).toBe(false);
  });

  test("threshold slider is available for IntAct and String sources", async ({ page }) => {
    const aotfTable = new AotfTable(page);
    const aotfInteractors = new AotfInteractors(page);

    await aotfTable.waitForTableLoad();

    // Open interactors
    await aotfTable.getContextMenuForRow(0).click();
    await page.locator("text=Target interactors").click();
    await aotfInteractors.waitForInteractorsLoad();

    // IntAct should have threshold available
    await aotfInteractors.selectSource(InteractorsSource.INTACT);
    await page.waitForTimeout(500);
    let thresholdAvailable = await aotfInteractors.isThresholdAvailable();
    test.expect(thresholdAvailable).toBe(true);

    // String should have threshold available
    await aotfInteractors.selectSource(InteractorsSource.STRING);
    await page.waitForTimeout(500);
    thresholdAvailable = await aotfInteractors.isThresholdAvailable();
    test.expect(thresholdAvailable).toBe(true);

    // Signor should NOT have threshold available
    await aotfInteractors.selectSource(InteractorsSource.SIGNOR);
    await page.waitForTimeout(500);
    thresholdAvailable = await aotfInteractors.isThresholdAvailable();
    test.expect(thresholdAvailable).toBe(false);
  });

  test("can close interactors panel", async ({ page }) => {
    const aotfTable = new AotfTable(page);
    const aotfInteractors = new AotfInteractors(page);

    await aotfTable.waitForTableLoad();

    // Open interactors
    await aotfTable.getContextMenuForRow(0).click();
    await page.locator("text=Target interactors").click();
    await aotfInteractors.waitForInteractorsLoad();

    // Verify visible
    await test.expect(aotfInteractors.getInteractorsTable()).toBeVisible();

    // Close interactors
    await aotfInteractors.closeInteractors();
    await aotfInteractors.waitForInteractorsClose();

    // Verify closed
    const isVisible = await aotfInteractors.isVisible();
    test.expect(isVisible).toBe(false);
  });

  test("interactors panel displays summary information", async ({ page }) => {
    const aotfTable = new AotfTable(page);
    const aotfInteractors = new AotfInteractors(page);

    await aotfTable.waitForTableLoad();

    // Open interactors
    await aotfTable.getContextMenuForRow(0).click();
    await page.locator("text=Target interactors").click();
    await aotfInteractors.waitForInteractorsLoad();

    // Get summary text
    const summaryText = await aotfInteractors.getSummaryText();

    // Summary should contain association count info
    test.expect(summaryText).toContain("target-disease association");
    test.expect(summaryText).toContain("interactor");
  });

  test("can paginate through interactors if available", async ({ page }) => {
    const aotfTable = new AotfTable(page);
    const aotfInteractors = new AotfInteractors(page);

    await aotfTable.waitForTableLoad();

    // Open interactors
    await aotfTable.getContextMenuForRow(0).click();
    await page.locator("text=Target interactors").click();
    await aotfInteractors.waitForInteractorsLoad();

    // Check if pagination is visible (only if there are enough results)
    const paginationVisible = await aotfInteractors
      .getPagination()
      .isVisible()
      .catch(() => false);

    if (paginationVisible) {
      const paginationText = await aotfInteractors.getPaginationText();
      test.expect(paginationText).toContain("of");

      // Check if we can go to next page
      const canGoNext = await aotfInteractors.canGoNextPage();
      if (canGoNext) {
        // Get first interactor name
        const firstPageName = await aotfInteractors.getInteractorName(0);

        // Go to next page
        await aotfInteractors.clickNextPage();
        await page.waitForTimeout(500);

        // Get new first interactor name
        const secondPageName = await aotfInteractors.getInteractorName(0);

        // Names should be different (different page)
        test.expect(firstPageName).not.toBe(secondPageName);
      }
    }
  });

  test("interactor data cells show correct evidence widgets", async ({ page }) => {
    const aotfTable = new AotfTable(page);
    const aotfInteractors = new AotfInteractors(page);
    const evidenceSection = new EvidenceSection(page);

    await aotfTable.waitForTableLoad();

    // Open interactors for the first row
    await aotfTable.getContextMenuForRow(0).click();
    await page.locator("text=Target interactors").click();
    await aotfInteractors.waitForInteractorsLoad();

    // Check if there are any interactor rows
    const interactorCount = await aotfInteractors.getInteractorRowCount();
    if (interactorCount === 0) {
      test.skip(true, "No interactors available for this target");
      return;
    }

    // Find the first interactor row with data cells
    const rowIndex = await aotfInteractors.findFirstRowWithData();
    if (rowIndex === null) {
      test.skip(true, "No interactor rows with data cells found");
      return;
    }

    // Get the interactor name for logging
    const interactorName = await aotfInteractors.getInteractorName(rowIndex);

    // Get all data cells with scores for this interactor
    const dataCells = await aotfInteractors.getDataCellsWithScores(rowIndex);

    if (dataCells.length === 0) {
      test.skip(true, `Interactor ${interactorName} has no data cells with scores`);
      return;
    }

    // Filter out non-evidence columns
    const nonEvidenceColumns = ["score"];
    const cellsToTest = dataCells.filter((cell) => !nonEvidenceColumns.includes(cell.columnId));

    if (cellsToTest.length === 0) {
      test.skip(true, `Interactor ${interactorName} has no evidence data cells`);
      return;
    }

    // Test at most 3 cells to keep test time reasonable
    const cellsToVerify = cellsToTest.slice(0, 3);

    for (const cell of cellsToVerify) {
      // Click on the data cell to open the evidence section
      await aotfInteractors.clickDataCell(rowIndex, cell.columnId);

      // Wait for section to load
      await evidenceSection.waitForSectionLoad(cell.columnId);

      // Verify that an evidence section is visible
      const hasSections = await evidenceSection.hasAnyEvidenceSection();
      test
        .expect(
          hasSections,
          `Interactor ${interactorName} - ${cell.columnId}: Should have evidence sections`
        )
        .toBe(true);

      // Verify the specific section for this data source is visible
      const isVisible = await evidenceSection.isEvidenceSectionVisible(cell.columnId);
      test
        .expect(
          isVisible,
          `Interactor ${interactorName} - ${cell.columnId}: Evidence section should be visible`
        )
        .toBe(true);

      // Verify no loader is visible
      const hasLoader = await evidenceSection.isLoaderVisible();
      test
        .expect(
          hasLoader,
          `Interactor ${interactorName} - ${cell.columnId}: Loader should not be visible`
        )
        .toBe(false);

      // Click the same cell again to close/toggle the section
      await aotfInteractors.clickDataCell(rowIndex, cell.columnId);

      // Wait for evidence section to close
      await evidenceSection.waitForLoaderToDisappear();
    }
  });
});
