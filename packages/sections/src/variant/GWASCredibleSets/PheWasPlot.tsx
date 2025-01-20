import { Box, Chip, Skeleton, Typography, useTheme } from "@mui/material";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ClinvarStars,
  Tooltip,
  Link,
  DisplayVariantId,
  OtScoreLinearBar,
  Plot,
  Vis,
  YAxis,
  YTick,
  XLabel,
  YLabel,
  XTitle,
  Point,
  Segment,
  Rect,
  HTMLTooltip,
  HTMLTooltipTable,
  HTMLTooltipRow,
} from "ui";
import { scaleLinear, min, scaleOrdinal } from "d3";
import { ScientificNotation, DataDownloader } from "ui";
import { naLabel, credsetConfidenceMap } from "../../constants";
import { Fragment } from "react";

const plotHeight = 450;
const tooltipHeight = 310;
const tooltipWidth = 360;

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

export default function PheWasPlot({
  loading,
  data,
  id,
  referenceAllele,
  alternateAllele,
  query,
  variables,
  columns,
}) {
  const theme = useTheme();
  const background = theme.palette.background.paper;
  const fontFamily = theme.typography.fontFamily;
  const pointArea = 64;

  if (loading) return <Skeleton height={plotHeight} />;
  if (data == null) return null;

  // eslint-disable-next-line
  data = data.filter(d => {
    return d.pValueMantissa != null && d.pValueExponent != null && d.variant != null;
  });
  if (data.length === 0) return null;
  // eslint-disable-next-line
  data = structuredClone(data);
  data.forEach(d => {
    d._y = Math.log10(d.pValueMantissa) + d.pValueExponent;
  });

  const yMin = min(data, d => d._y);
  const yMax = 0;

  const rowLookup = new Map(); // derived values for each row
  const diseaseGroups = new Map();
  for (const row of data) {
    const { id, name } = getTherapeuticArea(row);
    rowLookup.set(row, { therapeuticAreaId: id });
    diseaseGroups.has(id)
      ? diseaseGroups.get(id).data.push(row)
      : diseaseGroups.set(id, { name, data: [row] });
  }

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
      rowLookup.get(row).x = xCumu + 0.5;
      xCumu += 1;
      sortedData.push(row);
    }
    xCumu += xPad;
    xIntervals.get(id).end = xCumu;
  }

  const xScale = scaleLinear().domain([0, xCumu]);
  const yScale = scaleLinear().domain([yMin, yMax]).nice(); // ensure min scale value <= yMin
  yScale.domain([yScale.domain()[0], yMax]); // ensure max scale value is yMax - in case nice changed it

  const colorDomain = ["background"];
  const colorRange = [background];
  for (const [i, id] of sortedDiseaseIds.entries()) {
    colorDomain.push(id);
    colorRange.push(palette[i % palette.length]);
  }
  const colorScale = scaleOrdinal(colorDomain, colorRange);

  const pointAttrs = {
    x: d => rowLookup.get(d).x,
    y: d => d._y,
    fill: d => {
      return d.variant.id === id ? rowLookup.get(d).therapeuticAreaId : "background";
    },
    stroke: d => rowLookup.get(d).therapeuticAreaId,
    strokeWidth: 1.3,
    area: pointArea,
    hover: "stay",
    shape: d => (d.beta ? "triangle" : "circle"),
    rotation: d => (d.beta < 0 ? 180 : 0),
  };

  return (
    <>
      {/* legend */}
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

      {/* plot */}
      <Vis>
        <Plot
          responsive
          clearOnClick
          clearOnLeave
          height={plotHeight}
          padding={{ top: 30, right: 50, bottom: 120, left: 90 }}
          fontFamily={fontFamily}
          data={sortedData}
          yReverse
          scales={{
            x: xScale,
            y: yScale,
            fill: colorScale,
            stroke: colorScale,
            shape: scaleOrdinal(["circle", "triangle"], ["circle", "triangle"]),
          }}
        >
          {[...xIntervals].map(([id, { start, end }]) => (
            <Fragment key={id}>
              <XLabel
                values={[(start + end) / 2]}
                format={() => diseaseGroups.get(id).name}
                padding={3}
                textAnchor="start"
                dx={-2}
                style={{
                  transformOrigin: "0% 50%",
                  transformBox: "fill-box",
                  transform: "rotate(45deg)",
                }}
                fill={colorScale(id)}
              />
            </Fragment>
          ))}
          <Segment
            data={xIntervals}
            x={d => d[1].start}
            xx={d => d[1].end}
            y={yMax}
            yy={yMax}
            stroke={d => d[0]}
            strokeWidth={1}
          />
          <XTitle
            fontSize={11}
            position="top"
            align="left"
            textAnchor="middle"
            padding={16}
            dx={-30}
          >
            <tspan fontStyle="italic">
              -log
              <tspan fontSize="9" dy="4">
                10
              </tspan>
              <tspan dy="-4">(pValue)</tspan>
            </tspan>
          </XTitle>
          <YTick />
          <YLabel format={v => Math.abs(v)} />
          <Point {...pointAttrs} />

          {/* on hover */}
          <Rect
            dataFrom="hover"
            x={0}
            xx={sortedData.length}
            dxx={8}
            y={yMin}
            yy={yMax}
            dy={-8}
            dyy={0}
            fill={background}
            fillOpacity={0.4}
          />
          <Point dataFrom="hover" {...pointAttrs} />
          <HTMLTooltip
            x={(d, i) => rowLookup.get(d).x}
            y={d => yMin}
            pxWidth={tooltipWidth}
            pxHeight={tooltipHeight}
            content={d => tooltipContent(d, id)}
            xOffset={40}
            yOffset={-20}
          />

          {/* axes at end so fade rectangle doesn't cover them */}
          {/* <XAxis /> */}
          <YAxis />
        </Plot>
      </Vis>
    </>
  );
}

function tooltipContent(data, pageVariantId) {
  const labelWidth = 160;

  const displayId = (
    <DisplayVariantId
      variantId={data.variant.id}
      referenceAllele={data.variant.referenceAllele}
      alternateAllele={data.variant.alternateAllele}
      expand={false}
    />
  );

  return (
    <HTMLTooltipTable>
      <HTMLTooltipRow label="Navigate" data={data} labelWidth={labelWidth}>
        <Link to={`/credible-set/${data.studyLocusId}`}>
          <FontAwesomeIcon icon={faArrowRightToBracket} />
        </Link>
      </HTMLTooltipRow>
      <HTMLTooltipRow label="Lead variant" data={data} labelWidth={labelWidth}>
        {data.variant.id === pageVariantId ? (
          <Box display="flex" alignItems="center" gap={0.5}>
            {displayId}
            <Chip label="self" variant="outlined" size="small" />
          </Box>
        ) : (
          <Link to={`/variant/${data.variant.id}`}>{displayId}</Link>
        )}
      </HTMLTooltipRow>
      <HTMLTooltipRow
        label="Reported trait"
        data={data}
        labelWidth={labelWidth}
        valueWidth={`${tooltipWidth - labelWidth}px`}
        truncateValue
      >
        {data.study?.traitFromSource ?? naLabel}
      </HTMLTooltipRow>
      <HTMLTooltipRow
        label="Disease/phenotype"
        data={data}
        labelWidth={labelWidth}
        valueWidth={`${tooltipWidth - labelWidth}px`}
        truncateValue
      >
        {data.study?.diseases?.length > 0 ? (
          <>
            {data.study.diseases.map((d, i) => (
              <Fragment key={d.id}>
                {i > 0 && ", "}
                <Link to={`../disease/${d.id}`}>{d.name}</Link>
              </Fragment>
            ))}
          </>
        ) : (
          naLabel
        )}
      </HTMLTooltipRow>
      <HTMLTooltipRow label="Study" data={data} labelWidth={labelWidth}>
        {data.study ? <Link to={`/study/${data.study.id}`}>{data.study.id}</Link> : naLabel}
      </HTMLTooltipRow>
      <HTMLTooltipRow label="P-value" data={data} labelWidth={labelWidth}>
        <ScientificNotation number={[data.pValueMantissa, data.pValueExponent]} dp={2} />
      </HTMLTooltipRow>
      <HTMLTooltipRow label="Beta" data={data} labelWidth={labelWidth}>
        {data.beta?.toPrecision(3) ?? naLabel}
      </HTMLTooltipRow>
      <HTMLTooltipRow label="Posterior probability" data={data} labelWidth={labelWidth}>
        {data.locus?.rows?.[0].posteriorProbability.toPrecision(3) ?? naLabel}
      </HTMLTooltipRow>
      <HTMLTooltipRow label="Fine-mapping" data={data} labelWidth={labelWidth}>
        <Box display="flex" flexDirection="column" gap={0.25}>
          <Box display="flex" gap={0.5}>
            Method: {data.finemappingMethod ?? naLabel}
          </Box>
          <Box display="flex" gap={0.5}>
            Confidence:{" "}
            {data.confidence ? (
              <Tooltip title={data.confidence} style="">
                <ClinvarStars num={credsetConfidenceMap[data.confidence]} />
              </Tooltip>
            ) : (
              naLabel
            )}
          </Box>
        </Box>
      </HTMLTooltipRow>
      <HTMLTooltipRow label="L2G" data="data" labelWidth={labelWidth}>
        <Box display="flex" flexDirection="column" gap={0.25}>
          <Box display="flex" gap={0.5}>
            Top:{" "}
            {data.l2GPredictions?.rows?.[0]?.target ? (
              <Link to={`/target/${data.l2GPredictions.rows[0].target.id}`}>
                {data.l2GPredictions.rows[0].target.approvedSymbol}
              </Link>
            ) : (
              naLabel
            )}
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            Score:{" "}
            {data.l2GPredictions?.rows?.[0]?.score ? (
              <Tooltip title={data.l2GPredictions.rows[0].score.toFixed(3)} style="">
                <div>
                  <OtScoreLinearBar
                    variant="determinate"
                    value={data.l2GPredictions.rows[0].score * 100}
                  />
                </div>
              </Tooltip>
            ) : (
              naLabel
            )}
          </Box>
        </Box>
      </HTMLTooltipRow>
      <HTMLTooltipRow label="Credible set size" data={data} labelWidth={labelWidth}>
        {data.locusSize?.count ?? naLabel}
      </HTMLTooltipRow>
    </HTMLTooltipTable>
  );
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
