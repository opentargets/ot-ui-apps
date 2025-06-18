import { scaleLinear, interpolateLab, rgb, scaleLinear, range } from "d3";

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

const PRIORITISATION_COLORS = [
  rgb("#bc3a19"),
  rgb("#d65a1f"),
  rgb("#e08145"),
  rgb("#e3a772"),
  rgb("#e6ca9c"),
  rgb("#eceada"),
  rgb("#c5d2c1"),
  rgb("#9ebaa8"),
  rgb("#78a290"),
  rgb("#528b78"),
  rgb("#2f735f"),
];

export const normalisePathogenicity = scaleLinear([0, 0.06, 0.77, 1], [-1, -0.25, 0.25, 1]);

const normalisedPathogenicityToColor = scaleLinear()
  .domain([-1, -0.8, -0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1])
  .range([...PRIORITISATION_COLORS].reverse())
  .interpolate(interpolateLab)
  .clamp(true);

export function alphaFoldPathogenicityColorScale(score) {
  return normalisedPathogenicityToColor(normalisePathogenicity(score));
}

// window.alphaFoldPathogenicityColorScale = alphaFoldPathogenicityColorScale;

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
