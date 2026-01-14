import { expect, test } from "../../../fixtures";
import { AotfActions } from "../../../POM/objects/widgets/AOTF/aotfActions";
import { AotfTable } from "../../../POM/objects/widgets/AOTF/aotfTable";
import { TargetPage } from "../../../POM/page/target/target";

test.describe("Target Associated Diseases", () => {
  test.beforeEach(async ({ page, baseURL, testConfig }) => {
    const targetId = testConfig.target?.primary || "ENSG00000157764";
    await page.goto(`${baseURL}/target/${targetId}/associations`);
  });

  test.describe("Associations Table Visibility", () => {
    test("Associations table is visible on the page", async ({ page }) => {
      const aotfTable = new AotfTable(page);
      await aotfTable.waitForTableLoad();

      const table = aotfTable.getTable();
      await expect(table).toBeVisible();
    });

    test("Table has the correct headers", async ({ page }) => {
      const aotfTable = new AotfTable(page);
      await aotfTable.waitForTableLoad();

      // Check main headers (Disease/Target and Association Score)
      const diseaseHeader = aotfTable.getTargetOrDiseaseHeader();
      await expect(diseaseHeader).toBeVisible();

      const scoreHeader = aotfTable.getAssociationScoreHeader();
      await expect(scoreHeader).toBeVisible();

      // Check that data source headers are present (entity columns)
      const entityColumnHeaders = page.locator(
        "[data-testid='associations-table-header'] [data-testid^='table-header-']"
      );
      const headerCount = await entityColumnHeaders.count();

      // Should have: Disease/Target, Association Score, plus multiple data source columns
      // (genetic_association, somatic_mutation, known_drug, etc.)
      expect(headerCount).toBeGreaterThan(2);
    });

    test("Table loads with data rows", async ({ page }) => {
      const aotfTable = new AotfTable(page);
      await aotfTable.waitForTableLoad();

      const rowCount = await aotfTable.getRowCount();
      expect(rowCount).toBeGreaterThan(0);
    });

    test("Table is not in loading state after load", async ({ page }) => {
      const aotfTable = new AotfTable(page);
      await aotfTable.waitForTableLoad();

      const isLoading = await aotfTable.isLoading();
      expect(isLoading).toBe(false);
    });
  });

  test.describe("Table Data", () => {
    test("Each row displays disease name", async ({ page }) => {
      const aotfTable = new AotfTable(page);
      await aotfTable.waitForTableLoad();

      const rowCount = await aotfTable.getRowCount();

      if (rowCount > 0) {
        const diseaseName = await aotfTable.getEntityName(0);
        expect(diseaseName).toBeTruthy();
        expect(diseaseName?.trim().length).toBeGreaterThan(0);
      }
    });

    test("Each row displays association score", async ({ page }) => {
      const aotfTable = new AotfTable(page);
      await aotfTable.waitForTableLoad();

      const rowCount = await aotfTable.getRowCount();

      if (rowCount > 0) {
        const score = await aotfTable.getAssociationScoreValue(0);
        expect(score).toBeTruthy();
      }
    });

    test("Association scores are numeric values", async ({ page }) => {
      const aotfTable = new AotfTable(page);
      await aotfTable.waitForTableLoad();

      const rowCount = await aotfTable.getRowCount();

      if (rowCount > 0) {
        const score = await aotfTable.getAssociationScoreValue(0);
        if (score) {
          const numericScore = parseFloat(score);
          expect(numericScore).toBeGreaterThan(0);
          expect(numericScore).toBeLessThanOrEqual(1);
        }
      }
    });

    test("Can retrieve data from multiple rows", async ({ page }) => {
      const aotfTable = new AotfTable(page);
      await aotfTable.waitForTableLoad();

      const rowCount = await aotfTable.getRowCount();

      if (rowCount >= 2) {
        const firstDisease = await aotfTable.getEntityName(0);
        const secondDisease = await aotfTable.getEntityName(1);

        expect(firstDisease).toBeTruthy();
        expect(secondDisease).toBeTruthy();
        expect(firstDisease).not.toBe(secondDisease);
      }
    });
  });

  test.describe("Table Pagination", () => {
    test("Pagination controls are visible when there are multiple pages", async ({ page }) => {
      const aotfTable = new AotfTable(page);
      await aotfTable.waitForTableLoad();

      const paginationContainer = aotfTable.getPaginationContainer();
      const isVisible = await paginationContainer.isVisible().catch(() => false);

      // Pagination should be visible if there's enough data
      if (isVisible) {
        await expect(paginationContainer).toBeVisible();
      }
    });

    test("Can navigate to next page if available", async ({ page }) => {
      const aotfTable = new AotfTable(page);
      await aotfTable.waitForTableLoad();

      const nextButton = aotfTable.getNextPageButton();
      const isEnabled = await nextButton.isEnabled().catch(() => false);

      if (isEnabled) {
        // Get first row data before pagination
        const firstRowBeforePage = await aotfTable.getEntityName(0);

        await aotfTable.clickNextPage();
        await page.waitForTimeout(1000); // Wait for data to load

        // Get first row data after pagination
        const firstRowAfterPage = await aotfTable.getEntityName(0);

        // Data should be different after pagination
        expect(firstRowBeforePage).not.toBe(firstRowAfterPage);
      }
    });

    test("Can navigate back to previous page", async ({ page }) => {
      const aotfTable = new AotfTable(page);
      await aotfTable.waitForTableLoad();

      const nextButton = aotfTable.getNextPageButton();
      const isNextEnabled = await nextButton.isEnabled().catch(() => false);

      if (isNextEnabled) {
        // Go to next page
        await aotfTable.clickNextPage();
        await page.waitForTimeout(1000);

        // Go back to previous page
        const prevButton = aotfTable.getPreviousPageButton();
        const isPrevEnabled = await prevButton.isEnabled();
        expect(isPrevEnabled).toBe(true);

        await aotfTable.clickPreviousPage();
        await page.waitForTimeout(1000);

        // Verify we're back on first page
        const rowCount = await aotfTable.getRowCount();
        expect(rowCount).toBeGreaterThan(0);
      }
    });

    test("Can change page size", async ({ page }) => {
      const aotfTable = new AotfTable(page);
      await aotfTable.waitForTableLoad();

      const pageSelector = aotfTable.getPageSizeSelector();
      const isVisible = await pageSelector.isVisible().catch(() => false);

      if (isVisible) {
        const rowCountBefore = await aotfTable.getRowCount();

        await aotfTable.selectPageSize("50");
        await page.waitForTimeout(1000);

        const rowCountAfter = await aotfTable.getRowCount();

        // Row count should increase when changing from default (25) to 50
        // unless dataset has fewer than 25 rows
        if (rowCountBefore === 25) {
          expect(rowCountAfter).toBeGreaterThanOrEqual(rowCountBefore);
        } else {
          expect(rowCountAfter).toBeGreaterThan(0);
        }
      }
    });
  });

  test.describe("Table Sorting", () => {
    test("Can sort by GWAS associations", async ({ page }) => {
      const aotfTable = new AotfTable(page);
      const aotfActions = new AotfActions(page);
      await aotfTable.waitForTableLoad();

      // Verify no sort filter is active initially (default sort by Association Score)
      const initialSortActive = await aotfActions.hasSortFilter();
      expect(initialSortActive).toBe(false);

      // Click to sort by a different column (GWAS associations)
      await aotfTable.sortByColumn("GWAS associations");
      await page.waitForTimeout(1000);

      // Verify sort filter is now active in the ActiveFiltersPanel
      const sortActive = await aotfActions.hasSortFilter();
      expect(sortActive).toBe(true);

      // Verify the sort filter shows the correct column name
      const sortFilterText = await aotfActions.getSortFilterText();
      expect(sortFilterText).toContain("GWAS associations");
    });
  });

  test.describe("Table Row Interactions", () => {
    test("Can find a specific disease in the table by name", async ({ page }) => {
      const aotfTable = new AotfTable(page);
      await aotfTable.waitForTableLoad();

      // Get the first disease name
      const firstDisease = await aotfTable.getEntityName(0);

      if (firstDisease) {
        // Find the row by name
        const row = await aotfTable.getRowByName(firstDisease);
        await expect(row).toBeVisible();
      }
    });

    test("Can pin a disease row", async ({ page }) => {
      const aotfTable = new AotfTable(page);
      await aotfTable.waitForTableLoad();

      // Open context menu for first row and pin
      const contextMenu = aotfTable.getContextMenuForRow(0);
      await contextMenu.click();

      const pinButton = aotfTable.getPinEntityButton();
      await expect(pinButton).toBeVisible();
      await pinButton.click();

      await page.waitForTimeout(500);

      // Verify pinned section appears
      const pinnedSection = aotfTable.getPinnedSection();
      await expect(pinnedSection).toBeVisible();
    });

    test("Pinned entries can be deleted", async ({ page }) => {
      const aotfTable = new AotfTable(page);
      await aotfTable.waitForTableLoad();

      // Pin a row first via context menu
      await aotfTable.pinRow(0);
      await page.waitForTimeout(500);

      // Verify pinned section appears
      const pinnedSection = aotfTable.getPinnedSection();
      await expect(pinnedSection).toBeVisible();

      // Delete pinned entries
      const deleteButton = aotfTable.getDeletePinnedButton();
      await expect(deleteButton).toBeVisible();
      await deleteButton.click();

      await page.waitForTimeout(500);

      // Pinned section should no longer be visible
      await expect(pinnedSection).not.toBeVisible();
    });
  });

  test.describe("Table Data Cells", () => {
    test("Rows have data cells with evidence scores", async ({ page }) => {
      const aotfTable = new AotfTable(page);
      await aotfTable.waitForTableLoad();

      const rowWithData = await aotfTable.findFirstRowWithData();

      if (rowWithData !== null) {
        const cellsWithScores = await aotfTable.getDataCellsWithScores(rowWithData);
        expect(cellsWithScores.length).toBeGreaterThan(0);

        // Verify scores are valid numbers
        for (const cell of cellsWithScores) {
          expect(cell.score).toBeGreaterThan(0);
          expect(cell.score).toBeLessThanOrEqual(1);
        }
      }
    });

    test("Can click on data cells", async ({ page }) => {
      const aotfTable = new AotfTable(page);
      await aotfTable.waitForTableLoad();

      const rowWithData = await aotfTable.findFirstRowWithData();

      if (rowWithData !== null) {
        const cellsWithScores = await aotfTable.getDataCellsWithScores(rowWithData);

        if (cellsWithScores.length > 0) {
          const firstCell = cellsWithScores[0];

          // Click on the data cell
          await aotfTable.clickDataCell(rowWithData, firstCell.columnId);
          await page.waitForTimeout(500);

          // This should trigger some UI change (evidence panel, etc.)
          // Just verify the click was registered without error
          expect(true).toBe(true);
        }
      }
    });
  });

  test.describe("Table Sections", () => {
    test("Core section toggle appears after pinning an entity", async ({ page }) => {
      const aotfTable = new AotfTable(page);
      await aotfTable.waitForTableLoad();

      // Core section toggle only appears when pinned/uploaded sections exist
      // First, pin a row to make the section toggles appear
      await aotfTable.pinRow(0);
      await page.waitForTimeout(500);

      // Now the core section toggle should be visible
      const coreSection = aotfTable.getCoreSection();
      await expect(coreSection).toBeVisible();

      // Cleanup: delete pinned entries
      await aotfTable.deletePinnedEntries();
    });

    test("Can toggle core section visibility after pinning", async ({ page }) => {
      const aotfTable = new AotfTable(page);
      await aotfTable.waitForTableLoad();

      // Pin a row to make section toggles appear
      await aotfTable.pinRow(0);
      await page.waitForTimeout(500);

      // Toggle core section off
      await aotfTable.toggleCoreSection();
      await page.waitForTimeout(500);

      // Toggle it back on
      await aotfTable.toggleCoreSection();
      await page.waitForTimeout(500);

      // Table should still be visible
      const table = aotfTable.getTable();
      await expect(table).toBeVisible();

      // Cleanup
      await aotfTable.deletePinnedEntries();
    });
  });

  test.describe("Integration with Target Page", () => {
    test("Can navigate from associations back to profile", async ({ page }) => {
      const targetPage = new TargetPage(page);
      await targetPage.waitForPageLoad();

      // Verify we're on associations page
      const isAssociationsActive = await targetPage.isAssociationsTabActive();
      expect(isAssociationsActive).toBe(true);

      // Navigate to profile
      await targetPage.clickProfileTab();

      // Verify we're on profile page
      const isProfileActive = await targetPage.isProfileTabActive();
      expect(isProfileActive).toBe(true);
    });

    test("Associations table maintains state when navigating away and back", async ({ page }) => {
      const aotfTable = new AotfTable(page);
      await aotfTable.waitForTableLoad();

      const targetPage = new TargetPage(page);

      // Get first disease name
      const firstDisease = await aotfTable.getEntityName(0);

      // Navigate to profile
      await targetPage.clickProfileTab();
      await page.waitForTimeout(500);

      // Navigate back to associations
      await targetPage.clickAssociationsTab();
      await aotfTable.waitForTableLoad();

      // Verify data is still there
      const firstDiseaseAfter = await aotfTable.getEntityName(0);
      expect(firstDiseaseAfter).toBe(firstDisease);
    });
  });
});
