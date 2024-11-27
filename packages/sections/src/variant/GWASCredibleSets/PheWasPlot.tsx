import { Box, Skeleton, useTheme } from "@mui/material";
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
  XTick,
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
import { scaleLinear, scaleLog, min, scaleOrdinal, schemeCategory10, schemeDark2 } from "d3";
import { ScientificNotation } from "ui";
import { naLabel, credsetConfidenceMap } from "../../constants";
import { Fragment } from "react/jsx-runtime";

export default function PheWasPlot({ loading, data, id }) {

  const plotHeight = 440;
  const theme = useTheme();
  const background = theme.palette.background.paper;
  // const markColor = theme.palette.primary.main;
  const fontFamily = theme.typography.fontFamily;
  const pointArea = 64;

  const palette = [
    '#27B4AE',
    '#4047C4',
    '#F48730',
    '#DB4281',
    '#7E84F4',
    '#78DF76',
    '#1C7AED',
    '#7129CD',
    '#E7C73B',
    '#C95F1E',
    '#188E61',
    '#BEE952',
  ];
  // const palette = schemeCategory10;
  // const palette = schemeDark2;
  // const palette = schemeSet1;

  if (loading) return <Skeleton height={plotHeight} />;
  if (data == null) return null;

  // eslint-disable-next-line
  data = data.filter(d => {
    return d.pValueMantissa != null &&
      d.pValueExponent != null &&
      d.variant != null;
  });

  if (data.length === 0) return null;

  const pValueMin = min(data, pValue);
  const pValueMax = 1;

  const rowLookup = new Map();  // derived values for each row
  const diseaseGroups = new Map();
  for (const row of data) {
    const { id, name } = getTherapeuticArea(row);
    rowLookup.set(row, { therapeuticAreaId: id });
    diseaseGroups.has(id)
      ? diseaseGroups.get(id).data.push(row)
      : diseaseGroups.set(id, { name, data: [row] });
  }

  let sortedDiseaseIds =  // disease ids sorted by disease name
    [...diseaseGroups]
      .sort((a, b) => a[1].name.localeCompare(b[1].name))
      .map(a => a[0]);
  if (diseaseGroups.has('__uncategorised__')) {
    sortedDiseaseIds = sortedDiseaseIds.filter(id => id === '__uncategorised__');
    sortedDiseaseIds.shift('__uncategorised__');
  }
  const xIntervals = new Map();
  // const xMidpoints = [];
  let xCumu = 0;
  // const xGap = Math.ceil(data.length / 100);  // gap between groups
  // const xPad = Math.ceil(data.length / 100);  // padding at ede of groups
  const xGap = data.length / 300;  // gap between groups
  // const xGap = 0;
  const xPad = data.length / 500;  // padding at ede of groups
  const sortedData = [];
  // const sortedDiseaseNames = [];
  for (const id of sortedDiseaseIds) {
    const { name, data: newRows } = diseaseGroups.get(id);
    // sortedDiseaseNames.push(name);
    xCumu += xGap;
    xIntervals.set(id, { start: xCumu });
    xCumu += xPad;
    newRows.sort((row1, row2) => pValue(row1) - pValue(row2));
    for (const row of newRows) {
      rowLookup.get(row).x = xCumu + 0.5;
      xCumu += 1;
      sortedData.push(row);
    }
    xCumu += xPad;
    xIntervals.get(id).end = xCumu;
  }

  function xAnchor(row) {
    const x = rowLookup.get(row).x;
    return x < xCumu / 2 ? 'left' : 'right';
  }

  function yAnchor(row) {
    const y = pValue(row);
    return Math.log10(y) > Math.log10(pValueMin) / 2 ? 'bottom' : 'top';
  }

  const colorDomain = ['background'];
  const colorRange = [background];
  for (const [i, id] of sortedDiseaseIds.entries()) {
    colorDomain.push(id);
    colorRange.push(palette[i % palette.length]);
  }
  const colorScale = scaleOrdinal(colorDomain, colorRange);

  const pointAttrs = {
    x: d => rowLookup.get(d).x,
    y: pValue,
    fill: d => {
      return d.variant.id === id ? rowLookup.get(d).therapeuticAreaId : 'background';
    },
    stroke: d => rowLookup.get(d).therapeuticAreaId,
    strokeWidth: 1.3,
    area: pointArea,
    hover: 'stay',
    shape: d => d.beta ? 'triangle' : 'circle',
    rotation: d => d.beta < 0 ? 180 : 0,
  }

  return (
    <Vis>

      <Plot
        responsive
        clearOnClick
        clearOnLeave
        height={plotHeight}
        padding={{ top: 50, right: 40, bottom: 100, left: 90 }}
        fontFamily={fontFamily}
        data={sortedData}
        yReverse
        scales={{
          x: scaleLinear().domain([0, xCumu]),
          y: scaleLog().domain([pValueMin, pValueMax]),
          fill: colorScale,
          stroke: colorScale,
          shape: scaleOrdinal(['circle', 'triangle'], ['circle', 'triangle'])
        }}
      >
        {/* <XTick values={xTickValues} tickLength={7} /> */}
        {/* need to use different XLabel elements to use different colors */}

        {[...xIntervals].map(([id, { start, end }]) => (
          <Fragment key={id}>
            {/* <XTick
              values={[start, end]}
              stroke={colorScale(id)}
            /> */}
            <XLabel
              // key={id}
              values={[(start + end) / 2]}
              format={() => diseaseGroups.get(id).name}
              padding={3}
              textAnchor="start"
              dx={-2}
              style={{
                transformOrigin: '0% 50%',
                transformBox: 'fill-box',
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
          y={pValueMax}
          yy={pValueMax}
          stroke={d => d[0]}
          strokeWidth={1}
        />
        {/* <XGrid values={xTickValues} stroke="#e4e4e4" /> */}
        <XTitle fontSize={11} position="top" align="left" textAnchor="middle" padding={16} dx={-30}>
          <tspan fontStyle="italic">-log
            <tspan fontSize="9" dy="4">10</tspan>
            <tspan dy="-4">(pValue)</tspan>
          </tspan>
        </XTitle>
        <YTick />
        <YLabel format={v => -Math.log10(v)} />
        <Point {...pointAttrs} />

        {/* on hover */}
        <Rect
          dataFrom="hover"
          x={0}
          xx={sortedData.length}
          dxx={8}
          y={pValueMin}
          yy={pValueMax}
          dy={-8}
          dyy={0}
          fill={background}
          fillOpacity={0.4}
        />
        <Point dataFrom="hover" {...pointAttrs} />
        <HTMLTooltip
          x={(d, i) => rowLookup.get(d).x}
          y={d => pValueMin}
          // y={pValue}
          pxWidth={360}
          pxHeight={350}
          content={tooltipContent}
          xOffset={40}
          yOffset={-20}
        />

        {/* axes at end so fade rectangle doesn't cover them */}
        {/* <XAxis /> */}
        <YAxis />

      </Plot>
    </Vis >
  );

}

function tooltipContent(data) {

  const labelWidth = 148;
  // const valueWidth = 100;
  return (
    <HTMLTooltipTable>
      <HTMLTooltipRow label="Navigate" data={data} labelMinWidth={labelWidth}>
        <Link to={`/credible-set/${data.studyLocusId}`}>
          <FontAwesomeIcon icon={faArrowRightToBracket} />
        </Link>
      </HTMLTooltipRow>
      <HTMLTooltipRow label="Lead variant" data={data} labelMinWidth={labelWidth}>
        <Link to={`/variant/${data.variant.id}`}>
          <DisplayVariantId
            variantId={data.variant.id}
            referenceAllele={data.variant.referenceAllele}
            alternateAllele={data.variant.alternateAllele}
            expand={false}
          />
        </Link>
      </HTMLTooltipRow>
      <HTMLTooltipRow label="Reported trait" data={data} labelMinWidth={labelWidth} >
        {data.study?.traitFromSource ?? naLabel}
      </HTMLTooltipRow>
      <HTMLTooltipRow label="Disease/phenotype" data={data} labelMinWidth={labelWidth}>
        {data.study?.diseases?.length > 0
          ? <>
            {data.study.diseases.map((d, i) => (
              <Fragment key={d.id}>
                {i > 0 && ", "}
                <Link to={`../disease/${d.id}`}>{d.name}</Link>
              </Fragment>
            ))}
          </>
          : naLabel
        }
      </HTMLTooltipRow>
      <HTMLTooltipRow label="Study" data={data} labelMinWidth={labelWidth}>
        {data.study
          ? <Link to={`/study/${data.study.studyId}`}>
            {data.study.studyId}
          </Link>
          : naLabel
        }
      </HTMLTooltipRow>
      <HTMLTooltipRow label="P-value" data={data} labelMinWidth={labelWidth}>
        <ScientificNotation number={[data.pValueMantissa, data.pValueExponent]} />
      </HTMLTooltipRow>
      <HTMLTooltipRow label="Beta" data={data} labelMinWidth={labelWidth}>
        {data.beta?.toFixed(3) ?? naLabel}
      </HTMLTooltipRow>
      <HTMLTooltipRow label="Posterior probability" data={data} labelMinWidth={labelWidth}>
        {data.locus?.rows?.[0].posteriorProbability.toFixed(3) ?? naLabel}
      </HTMLTooltipRow>
      <HTMLTooltipRow label="Fine-mapping" data={data} labelMinWidth={labelWidth}>
        <Box display="flex" flexDirection="column" gap={0.25}>
          <Box display="flex" gap={0.5}>
            Confidence:
            {data.confidence
              ? <Tooltip title={data.confidence} style="">
                <ClinvarStars num={credsetConfidenceMap[data.confidence]} />
              </Tooltip>
              : naLabel
            }
          </Box>
          <Box display="flex" gap={0.5}>
            Method:{" "}{data.finemappingMethod ?? naLabel}
          </Box>
        </Box>
      </HTMLTooltipRow>
      <HTMLTooltipRow label="L2G" data="data" labelMinWidth={labelWidth}>
        <Box display="flex" flexDirection="column" gap={0.25}>
          <Box display="flex" gap={0.5}>
            Top:
            {data.l2Gpredictions?.[0]?.target
              ? <Link to={`/target/${data.l2Gpredictions[0].target.id}`}>
                {data.l2Gpredictions[0].target.approvedSymbol}
              </Link>
              : naLabel
            }
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            Score:
            {data.l2Gpredictions?.[0]?.score
              ? <Tooltip title={data.l2Gpredictions[0].score.toFixed(3)} style="">
                <div>
                  <OtScoreLinearBar variant="determinate" value={data.l2Gpredictions[0].score * 100} />
                </div>
              </Tooltip>
              : naLabel
            }
          </Box>
        </Box>
      </HTMLTooltipRow>
      <HTMLTooltipRow label="Credible set size" data={data} labelMinWidth={labelWidth}>
        {data.locus?.count ?? naLabel}
      </HTMLTooltipRow>
    </HTMLTooltipTable>
  );
}

function pValue(row) {
  return Math.max(
    row.pValueMantissa * 10 ** row.pValueExponent,
    Number.MIN_VALUE
  );
}

const therapeuticPriorities = {
  MONDO_0045024: { name: "cell proliferation disorder", rank: 1 },
  EFO_0005741: { name: "infectious disease", rank: 2 },
  OTAR_0000014: { name: "pregnancy or perinatal disease", rank: 3 },
  EFO_0005932: { name: "animal disease", rank: 4 },
  MONDO_0024458: { name: "disease of visual system", rank: 5 },
  EFO_0000319: { name: "cardiovascular disease", rank: 6 },
  EFO_0009605: { name: "pancreas disease", rank: 7 },
  EFO_0010282: { name: "gastrointestinal disease", rank: 8 },
  OTAR_0000017: { name: "reproductive system or breast disease", rank: 9 },
  EFO_0010285: { name: "integumentary system disease", rank: 10 },
  EFO_0001379: { name: "endocrine system disease", rank: 11 },
  OTAR_0000010: { name: "respiratory or thoracic disease", rank: 12 },
  EFO_0009690: { name: "urinary system disease", rank: 13 },
  OTAR_0000006: { name: "musculoskeletal or connective tissue disease", rank: 14 },
  MONDO_0021205: { name: "disease of ear", rank: 15 },
  EFO_0000540: { name: "immune system disease", rank: 16 },
  EFO_0005803: { name: "hematologic disease", rank: 17 },
  EFO_0000618: { name: "nervous system disease", rank: 18 },
  MONDO_0002025: { name: "psychiatric disorder", rank: 19 },
  OTAR_0000020: { name: "nutritional or metabolic disease", rank: 20 },
  OTAR_0000018: { name: "genetic, familial or congenital disease", rank: 21 },
  OTAR_0000009: { name: "injury, poisoning or other complication", rank: 22 },
  EFO_0000651: { name: "phenotype", rank: 23 },
  EFO_0001444: { name: "measurement", rank: 24 },
  GO_0008150: { name: "biological process", rank: 25 },
};

function getTherapeuticArea(row) {
  let bestId = null;
  let bestRank = Infinity;
  const areaIds = row.study.diseases.map(d => {
    return d.therapeuticAreas.map(area => area.id);
  }).flat();
  for (const id of areaIds) {
    const rank = therapeuticPriorities[id]?.rank;
    if (rank < bestRank) {
      bestId = id;
      bestRank = rank;
    }
  }
  return bestId
    ? { id: bestId, name: therapeuticPriorities[bestId].name }
    : { id: '__uncategorised__', name: 'Uncategorised' };
}   