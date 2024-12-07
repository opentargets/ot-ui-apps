const id = "shared_trait_studies";
export const definition = {
  id,
  name: "Shared Trait Studies",
  shortName: "ST",
  hasData: data => {
    return data?.sharedTraitStudies?.count > 1 || data?.count > 1;
  },
};
