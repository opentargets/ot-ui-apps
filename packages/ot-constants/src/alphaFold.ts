import { scaleLinear, interpolateLab, rgb, scaleQuantize } from "d3";

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

export function getAlphaFoldPathogenicity(score, propertyName = "label") {
  for (const obj of alphaFoldPathogenicityBands) {
    if (score > obj.lowerLimit) return obj[propertyName];
  }
  return alphaFoldPathogenicityBands[0][propertyName];
}

export const PRIORITISATION_COLORS = [
  rgb("#2e5943"),
  rgb("#2f735f"),
  rgb("#eceada"),
  rgb("#eceada"),
  rgb("#d65a1f"),
  rgb("#a01813"),
];

export const alphaFoldPathogenicityColorScale = scaleLinear()
  .domain([0, 0.1, 0.34, 0.564, 0.8, 1])
  .range(PRIORITISATION_COLORS)
  .interpolate(interpolateLab)
  .clamp(true);
// only some of the scale breakpoints are meaningful for the legend
alphaFoldPathogenicityColorScale._primaryDomain = [0, 0.34, 0.564, 1];

export function getAlphaFoldPathogenicityColor(score) {
  return alphaFoldPathogenicityColorScale(score);
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

export const aminoAcidTypeLookup = {
  GLY: "nonpolar",
  ALA: "nonpolar",
  VAL: "nonpolar",
  LEU: "nonpolar",
  ILE: "nonpolar",
  THR: "polar",
  SER: "polar",
  MET: "nonpolar",
  CYS: "polar",
  PRO: "nonpolar",
  PHE: "nonpolar",
  TYR: "polar",
  TRP: "nonpolar",
  HIS: "basic",
  LYS: "basic",
  ARG: "basic",
  ASP: "acid",
  GLU: "acid",
  ASN: "polar",
  GLN: "polar",
};

// hydrophobicity indices at ph7, from:
// https://www.sigmaaldrich.com/GB/en/technical-documents/technical-article/protein-biology/protein-structural-analysis/amino-acid-reference-chart#hydrophobicity
export const aminoAcidHydrophobicity = {
  PHE: { value: 100, label: "very hydrophobic" },
  ILE: { value: 99, label: "very hydrophobic" },
  TRP: { value: 97, label: "very hydrophobic" },
  LEU: { value: 97, label: "very hydrophobic" },
  VAL: { value: 76, label: "very hydrophobic" },
  MET: { value: 74, label: "very hydrophobic" },
  TYR: { value: 63, label: "hydrophobic" },
  CYS: { value: 49, label: "hydrophobic" },
  ALA: { value: 41, label: "hydrophobic" },
  THR: { value: 13, label: "neutral" },
  HIS: { value: 8, label: "neutral" },
  GLY: { value: 0, label: "neutral" },
  SER: { value: -5, label: "neutral" },
  GLN: { value: -10, label: "neutral" },
  ARG: { value: -14, label: "hydrophilic" },
  LYS: { value: -23, label: "hydrophilic" },
  ASN: { value: -28, label: "hydrophilic" },
  GLU: { value: -31, label: "hydrophilic" },
  PRO: { value: -46, label: "hydrophilic" },
  ASP: { value: -55, label: "hydrophilic" },
};