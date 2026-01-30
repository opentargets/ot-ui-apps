
import { GenTrackProvider, GenTrackTooltipProvider } from "ui";
import BodyContentInner from "./BodyContentInner";
import { extent } from "d3";

// from: https://www.ncbi.nlm.nih.gov/grc/human/data
// (first tab: "Chromosome lengths")
// !!! AND SHOULD MOVE TO OT-CONSTANTS - ALSO USED IN MANHATTTAN PLOT
const chromosomeInfo = [
  { chromosome: "1", length: 248956422 },
  { chromosome: "2", length: 242193529 },
  { chromosome: "3", length: 198295559 },
  { chromosome: "4", length: 190214555 },
  { chromosome: "5", length: 181538259 },
  { chromosome: "6", length: 170805979 },
  { chromosome: "7", length: 159345973 },
  { chromosome: "8", length: 145138636 },
  { chromosome: "9", length: 138394717 },
  { chromosome: "10", length: 133797422 },
  { chromosome: "11", length: 135086622 },
  { chromosome: "12", length: 133275309 },
  { chromosome: "13", length: 114364328 },
  { chromosome: "14", length: 107043718 },
  { chromosome: "15", length: 101991189 },
  { chromosome: "16", length: 90338345 },
  { chromosome: "17", length: 83257441 },
  { chromosome: "18", length: 80373285 },
  { chromosome: "19", length: 58617616 },
  { chromosome: "20", length: 64444167 },
  { chromosome: "21", length: 46709983 },
  { chromosome: "22", length: 50818468 },
  { chromosome: "X", length: 156040895 },
  { chromosome: "Y", length: 57227415 },
];

function BodyContent({ data }) {

  console.log(data);

  // !!!COMPUTE X LIMITS BASED ON VARIANTS FOR NOW - WILL NEED TO CHANGE WHEN PLOT MORE !!!
  const variantChromosome = data.locus.rows[0].variant.chromosome;
  let [xMin, xMax] = extent(data.locus.rows.map(({ variant }) => variant.position));
  xMin = Math.max(xMin - 500, 0);
  xMax = Math.min(xMax + 500, chromosomeInfo.find(({ chromosome }) => chromosome === variantChromosome).length);


  return (
    <GenTrackProvider initialState={{ data, xMin, xMax }} >
      <GenTrackTooltipProvider >
        <BodyContentInner />
      </GenTrackTooltipProvider>
    </GenTrackProvider>
  );
}

export default BodyContent;