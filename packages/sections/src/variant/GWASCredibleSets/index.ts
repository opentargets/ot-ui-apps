// !!!!!!!!!!
// ADD POSSIBILITY FOR PRIVATE SECTIONS IN PARTNER PAGE
// !!!!!!!!!!
// import { isPrivateVariantSection } from "../../utils/partnerPreviewUtils";

// !! NEED TO TYPE WHATEVER PASSED INTO HASDATA - SEE SUMMARY
const id = "gwas_credible_sets";
export const definition = {
  id,
  name: "GWAS Credible Sets",
  shortName: "CS",
  hasData: () => true,   // !! CHANGE WHEN USE GQL !!
  isPrivate: false,   // isPrivateVariantSection(id),
};
