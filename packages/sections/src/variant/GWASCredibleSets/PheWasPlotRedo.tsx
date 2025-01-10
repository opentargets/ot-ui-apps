import { Fragment, useRef, useEffect, useState } from "react";
import { useMeasure } from "@uidotdev/usehooks";
import * as PlotLib from "@observablehq/plot";
import { Box, Chip, Skeleton, Typography, useTheme, Fade } from "@mui/material";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ClinvarStars, Tooltip, Link, DisplayVariantId, OtScoreLinearBar } from "ui";
import { scaleLinear, min, scaleOrdinal } from "d3";
import { ScientificNotation, DataDownloader } from "ui";
import { naLabel, credsetConfidenceMap } from "../../constants";

const palette = [
  "#27B4AE",
  "#4047C4",
  "#F48730",
  "#DB4281",
  "#7E84F4",
  "#78DF76",
  "#1C7AED",
  "#7129CD",
  "#E7C73B",
  "#C95F1E",
  "#188E61",
  "#BEE952",
];

function PheWasPlotRedo({
  height = 410,
  columns,
  query,
  variables,
  loading,
  data,
  id,
  referenceAllele,
  alternateAllele,
}) {
  const [ref, { width }] = useMeasure();
  const [chart, setChart] = useState(null);
  const [datum, setDatum] = useState(null);
  return (
    <div>
      <Box sx={{ position: "relative", width: "100%", margin: "0 auto", mb: 6 }} ref={ref}>
        <Fade in>
          <div>
            <ChartControls data={data} query={query} columns={columns} variables={variables} />
            <Typography variant="body2" pt={1} pr={2} textAlign="right">
              <span style={{ fontSize: 10 }}>▲</span> Beta &gt; 0&emsp;&emsp;
              <span style={{ fontSize: 10 }}>▼</span> Beta &lt; 0&emsp;&emsp;
              <span style={{ fontSize: 10 }}>●</span> Beta {naLabel}&emsp;&emsp; Filled symbol:{" "}
              <b>
                <DisplayVariantId
                  variantId={id}
                  referenceAllele={referenceAllele}
                  alternateAllele={alternateAllele}
                  expand={false}
                />
              </b>{" "}
              is lead variant
            </Typography>
            <Plot
              data={data}
              width={width}
              height={height}
              setChart={setChart}
              setDatum={setDatum}
            />
          </div>
        </Fade>
      </Box>
    </div>
  );
}

function ChartControls({ data, query, variables, columns }) {
  return (
    <Box
      sx={{
        borderRadius: 1,
        display: "flex",
        justifyContent: "flex-end",
        gap: 1,
        mb: 2,
      }}
    >
      <DataDownloader
        btnLabel="Export"
        rows={data}
        query={query}
        variables={variables}
        columns={columns}
      />
    </Box>
  );
}

export default function Plot({
  width,
  height,
  loading,
  data: originalData,
  id,
  //   referenceAllele,
  //   alternateAllele,
  //   query,
  //   variables,
  //   columns,
}) {
  const headerRef = useRef();

  const theme = useTheme();
  const background = theme.palette.background.paper;
  const fontFamily = theme.typography.fontFamily;
  const pointArea = 64;

  // FIX OR REMOVE: TREATS USEEFFECT, USEREF, ... AS CONDITIONAL IF UNCOMMENT
  // if (loading) return <Skeleton height={plotHeight} />;

  // FIX OR REMOVE: TREATS USEEFFECT, USEREF, ... AS CONDITIONAL IF UNCOMMENT
  // if (data == null) return null;

  // copy data since add new properties
  const data = structuredClone(
    originalData.filter(d => {
      return d.pValueMantissa != null && d.pValueExponent != null && d.variant != null;
    })
  );
  // FIX OR REMOVE: TREATS USEEFFECT, USEREF, ... AS CONDITIONAL IF UNCOMMENT
  // if (data.length === 0) return null;

  const diseaseGroups = new Map();
  for (const row of data) {
    row._y = Math.log10(row.pValueMantissa) + row.pValueExponent;
    const { id, name } = getTherapeuticArea(row);
    row._therapeuticAreaId = id;
    diseaseGroups.has(id)
      ? diseaseGroups.get(id).data.push(row)
      : diseaseGroups.set(id, { name, data: [row] });
  }

  const yMin = min(data, d => d._y);
  const yMax = 0;

  let sortedDiseaseIds = // disease ids sorted by disease name
    [...diseaseGroups].sort((a, b) => a[1].name.localeCompare(b[1].name)).map(a => a[0]);
  if (diseaseGroups.has("__uncategorised__")) {
    sortedDiseaseIds = sortedDiseaseIds.filter(id => id !== "__uncategorised__");
    sortedDiseaseIds.push("__uncategorised__");
  }
  const xIntervals = new Map();
  let xCumu = 0;
  const xGap = data.length / 300; // gap between groups
  const xPad = data.length / 500; // padding at ede of groups
  const sortedData = [];
  for (const id of sortedDiseaseIds) {
    const { data: newRows } = diseaseGroups.get(id);
    xCumu += xGap;
    xIntervals.set(id, { start: xCumu });
    xCumu += xPad;
    newRows.sort((row1, row2) => row1._y - row2._y);
    for (const row of newRows) {
      row._x = xCumu + 0.5;
      xCumu += 1;
      sortedData.push(row);
    }
    xCumu += xPad;
    xIntervals.get(id).end = xCumu;
  }

  // const xScale = scaleLinear().domain([0, xCumu]);
  // const yScale = scaleLinear().domain([yMin, yMax]).nice(); // ensure min scale value <= yMin
  // yScale.domain([yScale.domain()[0], yMax]); // ensure max scale value is yMax - in case nice changed it

  // const colorDomain = ["background"];
  // const colorRange = [background];
  // for (const [i, id] of sortedDiseaseIds.entries()) {
  //   colorDomain.push(id);
  //   colorRange.push(palette[i % palette.length]);
  // }
  // const colorScale = scaleOrdinal(colorDomain, colorRange);

  const pointAttrs = {
    x: d => d._x,
    y: d => d._y,
    fill: d => {
      return d.variant.id === id ? d._therapeuticAreaId : "background";
    },
    stroke: d => d._therapeuticAreaId,
    strokeWidth: 1.3,
    area: pointArea,
    hover: "stay",
    shape: d => (d.beta ? "triangle" : "circle"),
    rotation: d => (d.beta < 0 ? 180 : 0),
  };

  // console.log(xIntervals);
  // console.log(xCumu);

  console.log({ yMin, yMax });

  useEffect(() => {
    if (data === undefined || width === null) return;
    const chart = PlotLib.plot({
      width,
      height,
      marginLeft: 90,
      marginRight: 50,
      marginTop: 30,
      marginBottom: 120,
      x: {
        // line: false,
        // grid: false,
        domain: [0, xCumu],
        axis: false,
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
        // ruleY mark for multi-segment x-axis
        PlotLib.ruleY(xIntervals, {
          x1: d => (console.log(d), d[1].start),
          x2: d => d[1].end,
          y: yMax,
          // strokeWidth: 2,
          // stroke: "red",
        }),

        // text mark for x-ticks

        // standard marks
      ],
    });
    headerRef.current.append(chart);
    return () => chart.remove();
  }, [originalData, width, height]);
  // }, [originalData, width, height, setChart, setDatum]);

  return <Box ref={headerRef}></Box>;
}

const therapeuticPriorities = {
  MONDO_0045024: { name: "cell proliferation", rank: 1 },
  EFO_0005741: { name: "infectious disease", rank: 2 },
  OTAR_0000014: { name: "pregnancy or perinatal", rank: 3 },
  EFO_0005932: { name: "animal disease", rank: 4 },
  MONDO_0024458: { name: "visual system", rank: 5 },
  EFO_0000319: { name: "cardiovascular", rank: 6 },
  EFO_0009605: { name: "pancreas", rank: 7 },
  EFO_0010282: { name: "gastrointestinal", rank: 8 },
  OTAR_0000017: { name: "reproductive system or breast", rank: 9 },
  EFO_0010285: { name: "integumentary system", rank: 10 },
  EFO_0001379: { name: "endocrine system", rank: 11 },
  OTAR_0000010: { name: "respiratory or thoracic", rank: 12 },
  EFO_0009690: { name: "urinary system", rank: 13 },
  OTAR_0000006: { name: "musculoskeletal or connective ...", rank: 14 },
  MONDO_0021205: { name: "disease of ear", rank: 15 },
  EFO_0000540: { name: "immune system", rank: 16 },
  EFO_0005803: { name: "hematologic", rank: 17 },
  EFO_0000618: { name: "nervous system", rank: 18 },
  MONDO_0002025: { name: "psychiatric", rank: 19 },
  OTAR_0000020: { name: "nutritional or metabolic", rank: 20 },
  OTAR_0000018: { name: "genetic, familial or congenital", rank: 21 },
  OTAR_0000009: { name: "injury, poisoning or complication", rank: 22 },
  EFO_0000651: { name: "phenotype", rank: 23 },
  EFO_0001444: { name: "measurement", rank: 24 },
  GO_0008150: { name: "biological process", rank: 25 },
};

function getTherapeuticArea(row) {
  let bestId = null;
  let bestRank = Infinity;
  const areaIds = row.study.diseases
    .map(d => {
      return d.therapeuticAreas.map(area => area.id);
    })
    .flat();
  for (const id of areaIds) {
    const rank = therapeuticPriorities[id]?.rank;
    if (rank < bestRank) {
      bestId = id;
      bestRank = rank;
    }
  }
  return bestId
    ? { id: bestId, name: therapeuticPriorities[bestId].name }
    : { id: "__uncategorised__", name: "Uncategorised" };
}

/* TODO

- fix width of plot, then finish adding marks

*/
