import { csvParse, mean } from "d3";
import { safeFetch } from "./fetch";
import { alphaFoldPathogenicityUrl } from "./urls";
  
// returns map of pathogenicity scores grouped by residue index (number). Each
// group is an array of objects giving pathogencity scores for alternate amino
// acids:
//  {
//    protein_variant (string): e.g. "M1E" - current AA, residue index, alternate AA
//    am_pathogenicity (string): score
//    am_class (string)
//  } 
export async function fetchPathogenicityScores(uniprotId: string) {
  const [scoresCSV, error] =
    await safeFetch(alphaFoldPathogenicityUrl(uniprotId), "text");
  if (error) return [undefined, error];
  const scores = Map.groupBy(
    csvParse(scoresCSV),  // string -> array of objects
    row => Number(row.protein_variant.match(/\d+/)[0])  
  );
  return [scores, undefined];
};

// returns map:
// - key (number): residue index
// - value (number): mean pathogenicity score over alternate amino acids
export function meanPathogenicityScores(pathogenicityScores) {
  const meanScores = new Map();
  for ([resi, group] of pathogenicityScores) {
    meanScores.set(resi, mean(group, d => Number(d.am_pathogenicity)));
  }
  return meanScores;
}

// pathogenicity score (number) for given residue index and alternate amino acid
export function pickPathogenicityScore(pathogenicityScores, resi, alternateAminoAcid) {
  const row = pathogenicityScores
    .get(Number(resi))
    .find(row => row.protein_variant.at(-1) === alternateAminoAcid);
  return row ? Number(row.am_pathogenicity) : undefined;
}