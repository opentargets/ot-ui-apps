const id = "related_gwas_studies";
export const definition = {
  id,
  name: "Related GWAS Studies",
  shortName: "RS",
  hasData: data => {
    if (data?.relatedGWASStudies) {  // summary
      return data.relatedGWASStudies.some(relatedStudy => (
        relatedStudy.studyId !== data.gwasStudy[0].studyId
      ));
    } 
    return data?.length > 0;
  },
};