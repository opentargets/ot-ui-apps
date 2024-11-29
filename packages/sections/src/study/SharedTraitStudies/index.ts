const id = "shared_trait_studies";
export const definition = {
  id,
  name: "Shared Trait Studies",
  shortName: "ST",
  hasData: data => {
    return data?.sharedTraitStudies?.rows.length > 0 || data?.rows.length > 0;
  },
};
