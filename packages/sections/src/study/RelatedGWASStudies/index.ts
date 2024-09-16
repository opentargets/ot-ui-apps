const id = "related_gwas_studies";
export const definition = {
  id,
  name: "Related GWAS Studies",
  shortName: "RS",
  hasData: data => {
    // console.log(data?.relatedGWASStudies?.length);
    return data?.relatedGWASStudies?.length;
  }
  // hasData: data => {
  //   for (const { studyId } of data?.relatedStudies || []) {
  //     if (studyId !== data?.thisStudy?.studyId) {
  //       return true;
  //     }
  //   }
  //   return false;
  // },
};