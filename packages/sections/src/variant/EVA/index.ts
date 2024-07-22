
// !!!!!!!!!!
// ADD POSSIBILITY FOR PRIVATE SECTIONS IN PARTNER PAGE
// !!!!!!!!!!
// import { isPrivateVariantSection } from "../../utils/partnerPreviewUtils";

// !! NEED TO TYPE WHATEVER PASSED INTO HASDATA - SEE SUMMARY
const id = "eva";
export const definition = {
  id,
  name: "ClinVar",
  shortName: "CV",
  hasData: () => true,   // !! CHANGE WHEN USE GQL !!
  // hasData: ({ eva }) => eva.count > 0,
  isPrivate: false,   // isPrivateVariantSection(id),
};
