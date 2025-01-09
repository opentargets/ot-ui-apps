import { useRef, useEffect, useState } from "react";
import { Box, Skeleton, useTheme, Fade } from "@mui/material";
import { ClinvarStars, Link, Tooltip, DisplayVariantId, Navigate, OtScoreLinearBar } from "ui";
import { useMeasure } from "@uidotdev/usehooks";
import * as PlotLib from "@observablehq/plot";
import { ScientificNotation } from "ui";
import { naLabel, credsetConfidenceMap } from "../../constants";

function ManhattanLollipopPlot({ data, height = 380, query, variables, columns }) {
  const [ref, { width }] = useMeasure();
  const [chart, setChart] = useState(null);
  const [datum, setDatum] = useState(null);
  return (
    <div>
      <Box sx={{ position: "relative", width: "100%", margin: "0 auto", mb: 6 }} ref={ref}>
        <Fade in>
          <div>
            <Plot
              data={data}
              width={width}
              height={height}
              setChart={setChart}
              setDatum={setDatum}
            />
            <PlotTooltip
              width={width}
              height={height}
              chart={chart}
              datum={datum}
              xAccessor={d => d._genomePosition}
              yAccessor={d => d._y}
            />
          </div>
        </Fade>
      </Box>
    </div>
  );
}

function Plot({ loading, data: originalData, width, height, setChart, setDatum }) {
  // FIX OR REMOVE: TREATS USEEFFECT, USEREF, ... AS CONDITIONAL IF UNCOMMENT
  // if (loading) return <Skeleton height={plotHeight} />;

  const headerRef = useRef();

  const theme = useTheme();
  const background = theme.palette.background.paper;
  const markColor = theme.palette.primary.main;
  const fontFamily = theme.typography.fontFamily;

  // FIX OR REMOVE: TREATS USEEFFECT, USEREF, ... AS CONDITIONAL IF UNCOMMENT
  // if (originalData == null) return null;

  const data = structuredClone(
    originalData.filter(d => {
      return d.pValueMantissa != null && d.pValueExponent != null && d.variant != null;
    })
  );
  // FIX OR REMOVE: TREATS USEEFFECT, USEREF, ... AS CONDITIONAL IF UNCOMMENT
  // if (data.length === 0) return null;

  const yMax = 0;
  let yMin = Infinity;
  for (const d of data) {
    const y = Math.log10(d.pValueMantissa) + d.pValueExponent;
    yMin = Math.min(yMin, y);
    d._y = y;
    d._genomePosition = cumulativePosition(d.variant);
  }

  function highlightElement(elmt) {
    elmt.parentNode.appendChild(elmt);
    elmt.style.fill = markColor;
    elmt.style.strokeOpacity = 1;
    if (elmt.tagName === "line") elmt.style.strokeWidth = 1.7;
  }

  function fadeElement(elmt) {
    elmt.style.fill = background;
    elmt.style.strokeOpacity = 0.6;
    elmt.style.strokeWidth = 1;
  }

  function resetElement(elmt) {
    elmt.style.fill = background;
    elmt.style.strokeOpacity = 1;
    elmt.style.strokeWidth = 1;
  }

  useEffect(() => {
    if (data === undefined || width === null) return;
    const chart = PlotLib.plot({
      width,
      height,
      label: null,
      marginLeft: 90,
      marginRight: 40,
      x: {
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
          x: d => d._genomePosition,
          y: d => d._y,
          y2: yMax,
          strokeWidth: 1,
          stroke: markColor,
          className: "standard-mark",
        }),
        PlotLib.dot(data, {
          x: d => d._genomePosition,
          y: d => d._y,
          strokeWidth: 1,
          stroke: markColor,
          fill: background,
          r: 3,
          className: "standard-mark",
        }),
      ],
    });
    setChart(chart);
    let clickStick = false;
    const markElements = [...chart.querySelectorAll(".standard-mark circle, .standard-mark line")];
    for (const elmt of markElements) {
      const dataIndex = elmt.__data__;
      elmt.setAttribute("data-index", dataIndex);
      elmt.addEventListener("mouseenter", event => {
        if (!clickStick) {
          setDatum(data[dataIndex]);
          markElements.forEach(fadeElement);
          chart.querySelectorAll(`[data-index="${dataIndex}"]`).forEach(highlightElement);
        }
      });
      elmt.addEventListener("mouseleave", event => {
        if (!clickStick) {
          setDatum(null);
          chart.querySelectorAll(`[data-index="${dataIndex}"]`).forEach(resetElement);
        }
      });
    }
    chart.addEventListener("click", event => {
      clickStick = !clickStick;
      if (!clickStick) {
        setDatum(null);
        markElements.forEach(resetElement);
      }
    });
    headerRef.current.append(chart);
    return () => chart.remove();
  }, [originalData, width, height, setChart, setDatum]);

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

function PlotTooltip({
  chart,
  datum,
  width,
  height,
  xAccessor,
  yAccessor,
  anchor = "top-left",
  dx = 10,
  dy = 10,
  children,
}) {
  // debugger;
  if (!datum) return null;
  const x = chart.scale("x").apply(xAccessor(datum));
  const y = chart.scale("y").apply(yAccessor(datum));
  return (
    <Box
      width={width}
      height={height}
      position="absolute"
      top={0}
      left={0}
      sx={{ pointerEvents: "none" }}
    >
      {datum && (
        <Box
          sx={{
            position: "absolute",
            [anchor.includes("right") ? "right" : "left"]: x + dx,
            [anchor.includes("bottom") ? "bottom" : "top"]: y + dy,
            border: "1px solid #888",
          }}
        >
          {/* WILL ADD CONTENT OF TOOLTIP FROM REACT CHART HERE */}
          <h1>{datum.variant.id}</h1>
          {/* {children} */}
        </Box>
      )}
    </Box>
  );
}

/* TODO

CHECKS:
- not getting issue of nice changing the yMax (resulting in decimal ticks
  values)? - check properly

INTERACTION:
- highlighted line does not jump in front of circlees - possibly okay
  since most users will hover on circles (not lines) so good to leave all circles
  above lines?
- if over a new mark and click to remove old sticky tooltip, the new tooltip is
  not shown
  - check clickStick and related logic to fix this and any other corner cases

POLISH APPEARANCE
- fonts: family, sizes, style, weight, alignment, offset  ...
- axis and grid width, color, dashed, ...

CLEAN UP
- add types where appropriate
- reusable components and patterns for common plot stuff - responsive container,
  plot controls, tooltip, other?
- how com never get searchSuggestion rs7412 on this local branch?!

*/
