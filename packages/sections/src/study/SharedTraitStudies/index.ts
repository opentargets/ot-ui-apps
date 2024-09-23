const id = "shared_trait_studies";
export const definition = {
  id,
  name: "Shared Trait Studies",
  shortName: "ST",
  hasData: data => {
    if (data?.sharedTraitStudies) {  // summary
      return data.sharedTraitStudies.some(study => (
        study.studyId !== data.gwasStudy?.[0]?.studyId
      ));
    } 
    return data?.length > 0;
  },
};