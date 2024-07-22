// !!!!!!!!!!
// ADD POSSIBILITY FOR PRIVATE SECTIONS IN PARTNER PAGE
// !!!!!!!!!!
// import { isPrivateVariantSection } from "../../utils/partnerPreviewUtils";

// !! NEED TO TYPE WHATEVER PASSED INTO HASDATA - SEE SUMMARY
const id = "qtl_credible_sets";
export const definition = {
  id,
  name: "molQTL Credible Sets",
  shortName: "QT",
  hasData: () => true,   // !! CHANGE WHEN USE GQL !!
  isPrivate: false,   // isPrivateVariantSection(id),
};