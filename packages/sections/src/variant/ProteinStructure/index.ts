const id = "protein_structure";
export const definition = {
  id,
  name: "Protein Structure",
  shortName: "PS",

  // !! FIX BELOW WHEN HAVE DATA !! PROBABLY WILL DEPEND ON:
  // - IF VARIANT OVERLAPS ANY TARGETS
  // - IF HAVE ALPHAFOLD (THOUGH MAY NOT KNOW THAT FROM OUR API)

  hasData: data => true,
};
