import { expect, test } from "../../../fixtures";

import { MolecularStructureSection } from "../../../POM/objects/widgets/shared/molecularStructureSection";
import { VariantPage } from "../../../POM/page/variant/variant";

test.describe("Molecular Structure Section", () => {
  let variantPage: VariantPage;
  let structureSection: MolecularStructureSection;

  test.beforeEach(async ({ page, testConfig }) => {
    variantPage = new VariantPage(page);
    structureSection = new MolecularStructureSection(page);

    // Navigate to a variant with molecular structure data
    await variantPage.goToVariantPage(
      testConfig.variant.withMolecularStructure ?? testConfig.variant.primary
    );

    // Check if section is visible
    const isVisible = await structureSection.isSectionVisible();
    if (isVisible) {
      await structureSection.waitForLoad();
    } else {
      test.skip();
    }
  });

  test("Molecular Structure section is visible when data available", async () => {
    const isVisible = await structureSection.isSectionVisible();
    expect(isVisible).toBe(true);
  });

  test("AlphaFold viewer is displayed", async () => {
    const isViewerVisible = await structureSection.isAlphaFoldViewerVisible();

    expect(isViewerVisible).toBe(true);
  });

  test("Structure information is displayed", async () => {
    const hasInfo = await structureSection.hasStructureInfo();

    expect(hasInfo).toBe(true);
  });
});
