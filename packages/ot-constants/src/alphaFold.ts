import { scaleLinear, interpolateLab } from "d3";

export const alphaFoldConfidenceBands = [
  { lowerLimit: 90, label: "Very high", sublabel: "pLDDT > 90", color: "rgb(0, 83, 214)" },
  {
    lowerLimit: 70,
    label: "Confident",
    sublabel: "90 > pLDDT > 70",
    color: "rgb(101, 203, 243)",
  },
  { lowerLimit: 50, label: "Low", sublabel: "70 > pLDDT > 50", color: "rgb(255, 219, 19)" },
  { lowerLimit: 0, label: "Very low ", sublabel: "pLDDT < 50", color: "rgb(255, 125, 69)" },
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

// color give the bin color, use getAlphaFoldPathogenicityColor for continuous color
export function getAlphaFoldPathogenicity(atom, propertyName = "label", scores) {
  for (const obj of alphaFoldConfidenceBands) {
    if (scores[atom.resi] > obj.lowerLimit) return obj[propertyName];
  }
  return alphaFoldConfidenceBands[0][propertyName];
}

const alphaFoldPathogenicityColorScale = scaleLinear()
  .domain([0, 0.34, 0.564, 1])
  .range(["rgb(61, 84, 147)", "rgb(168, 169, 173)", "rgb(168, 169, 173)", "rgb(203, 25, 25)"])
  .interpolate(interpolateLab)
  .clamp(true);

export function getAlphaFoldPathogenicityColor(atom, scores) {
  return alphaFoldPathogenicityColorScale(scores[atom.resi]);
}
