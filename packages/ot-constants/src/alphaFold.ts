import { scaleLinear, interpolateLab } from "d3";

export const alphaFoldConfidenceBands = [
  { lowerLimit: 90, label: "Very high", sublabel: "90 > pLDDT", color: "rgb(0, 83, 214)" },
  {
    lowerLimit: 70,
    label: "Confident",
    sublabel: "70 > pLDDT < 90",
    color: "rgb(101, 203, 243)",
  },
  { lowerLimit: 50, label: "Low", sublabel: "50 > pLDDT < 70", color: "rgb(255, 219, 19)" },
  { lowerLimit: 0, label: "Very low ", sublabel: "50 > pLDDT", color: "rgb(255, 125, 69)" },
];

export function getAlphaFoldConfidence(atom, propertyName = "label") {
  for (const obj of alphaFoldConfidenceBands) {
    if (atom.b > obj.lowerLimit) return obj[propertyName];
  }
  return alphaFoldConfidenceBands[0][propertyName];
}

export const alphaFoldPathogenicityBands = [
  {
    lowerLimit: 0.564,
    label: "Likely pathogenic",
    sublabel: "score > 0.564",
    color: "rgb(154, 19, 26)",
  },
  {
    lowerLimit: 0.34,
    label: "Uncertain",
    sublabel: "0.564 ≥ score > 0.34",
    color: "rgb(168, 169, 173)",
  },
  { lowerLimit: 0, label: "Likely benign", sublabel: "score < 0.34", color: "rgb(61, 84, 147)" },
];

export function getAlphaFoldPathogenicity(atom, scores, propertyName = "label") {
  const score = scores[atom.resi];
  for (const obj of alphaFoldPathogenicityBands) {
    if (score > obj.lowerLimit) return obj[propertyName];
  }
  return alphaFoldPathogenicityBands[0][propertyName];
}

export const alphaFoldPathogenicityColorScale = scaleLinear()
  .domain([0, 0.34, 0.564, 1])
  .range(["rgb(61, 84, 147)", "rgb(168, 169, 173)", "rgb(168, 169, 173)", "rgb(203, 25, 25)"])
  .interpolate(interpolateLab)
  .clamp(true);

export function getAlphaFoldPathogenicityColor(atom, scores) {
  return alphaFoldPathogenicityColorScale(scores[atom.resi]);
}

export const aminoAcidLookup = {
  G: "GLY",
  A: "ALA",
  V: "VAL",
  L: "LEU",
  I: "ILE",
  T: "THR",
  S: "SER",
  M: "MET",
  C: "CYS",
  P: "PRO",
  F: "PHE",
  Y: "TYR",
  W: "TRP",
  H: "HIS",
  K: "LYS",
  R: "ARG",
  D: "ASP",
  E: "GLU",
  N: "ASN",
  Q: "GLN",
};
