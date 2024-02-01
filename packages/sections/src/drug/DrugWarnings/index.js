export const definition = {
  id: "drugWarnings",
  name: "Drug Warnings",
  shortName: "DW",
  hasData: ({ hasBeenWithdrawn, blackBoxWarning }) => hasBeenWithdrawn || blackBoxWarning,
};
