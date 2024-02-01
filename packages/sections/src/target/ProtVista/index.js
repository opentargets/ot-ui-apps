export const definition = {
  id: "protVista",
  name: "ProtVista",
  shortName: "PV",
  hasData: ({ proteinIds }) => proteinIds.some(e => e.source === "uniprot_swissprot"),
};
