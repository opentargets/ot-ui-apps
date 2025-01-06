import { useRef, useEffect } from "react";
import { Box, Skeleton, useTheme, Fade } from "@mui/material";
import { ClinvarStars, Link, Tooltip, DisplayVariantId, Navigate, OtScoreLinearBar } from "ui";
import { useMeasure } from "@uidotdev/usehooks";
import * as PlotLib from "@observablehq/plot";
import { ScientificNotation } from "ui";
import { naLabel, credsetConfidenceMap } from "../../constants";

function ManhattanLollipopPlot({ data, query, variables, columns }) {
  const [ref, { width }] = useMeasure();
  return (
    <div>
      <Box sx={{ width: "100%", margin: "0 auto", mb: 6 }} ref={ref}>
        <Fade in>
          <div>
            <Plot data={data} width={width} />
          </div>
        </Fade>
      </Box>
    </div>
  );
}

function Plot({ loading, data: originalData, width }) {
  // FIX THIS: TREATS USEEFFECT, ASEREF, ... AS CONDISTIONAL IF UNCOMMENT
  // if (loading) return <Skeleton height={plotHeight} />;

  const headerRef = useRef();

  const plotHeight = 380;
  const theme = useTheme();
  const background = theme.palette.background.paper;
  const markColor = theme.palette.primary.main;
  const fontFamily = theme.typography.fontFamily;

  // FIX THIS: TREATS USEEFFECT, ASEREF, ... AS CONDISTIONAL IF UNCOMMENT
  // if (originalData == null) return null;

  const data = originalData.filter(d => {
    return d.pValueMantissa != null && d.pValueExponent != null && d.variant != null;
  });
  // FIX THIS: TREATS USEEFFECT, ASEREF, ... AS CONDISTIONAL IF UNCOMMENT
  // if (data.length === 0) return null;

  const yValues = {};
  const genomePositions = {};
  const yMax = 0;
  let yMin = Infinity;
  for (const d of data) {
    const id = d.variant.id;
    const y = Math.log10(d.pValueMantissa) + d.pValueExponent;
    yMin = Math.min(yMin, y);
    yValues[id] = y;
    genomePositions[id] = cumulativePosition(d.variant);
  }

  useEffect(() => {
    if (data === undefined || width === null) return;
    const chart = PlotLib.plot({
      width: width,
      height: plotHeight,
      label: null,
      marginLeft: 90,
      marginRight: 40,
      x: {
        // axis: "bottom",
        line: true,

        grid: true,
        domain: [0, genomeLength],
        ticks: [0, ...chromosomeInfo.map(chromo => chromo.end)],
        tickSize: 16,
        tickFormat: v => "",
      },
      y: {
        domain: [yMin, yMax],
        reverse: true,
        nice: true,
        line: true,
        label: "-log_10(pValue)",
        labelAnchor: "top",
        labelArrow: "none",
        tickFormat: v => Math.abs(v),
      },
      marks: [
        // text mark for the x-axis labels
        PlotLib.text(chromosomeInfo, {
          x: d => d.midpoint,
          y: yMax,
          text: d => d.chromosome,
          lineAnchor: "top",
          dy: 6,
        }),

        // standard marks
        PlotLib.ruleX(data, {
          x: d => genomePositions[d.variant.id],
          y: d => yValues[d.variant.id],
          y2: yMax,
          strokeWidth: 1,
          stroke: markColor,
        }),
        PlotLib.dot(data, {
          x: d => genomePositions[d.variant.id],
          y: d => yValues[d.variant.id],
          strokeWidth: 1,
          stroke: markColor,
          fill: background,
          r: 3,
        }),

        // pointer marks
        // PlotLib.ruleX(
        //   data,
        //   PlotLib.pointerX({
        //     x: d => genomePositions[d.variant.id],
        //     y: d => yValues[d.variant.id],
        //     y2: yMax,
        //     strokeWidth: 2,
        //     stroke: markColor,
        //   })
        // ),
        PlotLib.dot(
          data,
          PlotLib.pointer({
            x: d => genomePositions[d.variant.id],
            y: d => yValues[d.variant.id],
            strokeWidth: 1,
            stroke: markColor,
            fill: markColor,
            r: 3,
          })
        ),
      ],
    });
    headerRef.current.append(chart);
    return () => chart.remove();
  }, [data, width]);

  return <Box ref={headerRef}></Box>;
}

export default ManhattanLollipopPlot;

// from: https://www.ncbi.nlm.nih.gov/grc/human/data
// (first tab: "Chromosome lengths")
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

chromosomeInfo.forEach((chromo, i) => {
  chromo.start = chromosomeInfo[i - 1]?.end ?? 0;
  chromo.end = chromo.start + chromo.length;
  chromo.midpoint = (chromo.start + chromo.end) / 2;
});

const genomeLength = chromosomeInfo.at(-1).end;

const chromosomeInfoMap = new Map(chromosomeInfo.map(obj => [obj.chromosome, obj]));

function cumulativePosition({ chromosome, position }) {
  return chromosomeInfoMap.get(chromosome).start + position;
}

/* TODO

check if need yScale correction, in REact plot used:
// const yScale = scaleLinear().domain([yMin, yMax]).nice(); // ensure min scale value <= yMin
// yScale.domain([yScale.domain()[0], yMax]); // ensure max scale value is yMax - in case nice changed it

INTERACTION:
- Decide if pointer transform is powerful enough to handle 2-element mark and fade other
  points. If not look at adding event listener to chart (covered in pointer transform docs)
- tooltip

POLISH APPEARANCE
- fonts: family, sizes, style, weight, alignment, offset  ...
- axis and grid width, color, dashed, ...

OTHER
- add types where appropriate
- reusable container(s) for common plot stuff - responsive, plot controls, other?

*/
