import { Skeleton, Typography, useTheme } from "@mui/material";
import {
  Link,
  DisplayVariantId,
  Plot,
  Vis,
  XAxis,
  YAxis,
  XTick,
  YTick,
  XLabel,
  YLabel,
  XTitle,
  XGrid,
  Circle,
  Point,
  Segment,
  Rect,
  HTML,
} from "ui";
import { scaleLinear, scaleLog, min, scaleOrdinal, schemeCategory10, schemeDark2, schemeObser } from "d3";
import { ScientificNotation } from "ui";
import { naLabel } from "../../constants";
import { groupBy } from "lodash";

export default function PheWasPlot({ loading, data, id }) {

  const plotHeight = 440;
  const theme = useTheme();
  const background = theme.palette.background.paper;
  // const markColor = theme.palette.primary.main;
  const fontFamily = theme.typography.fontFamily;
  const pointArea = 64;

  // const palette = [
  //   '#27B4AE',
  //   '#4047C4',
  //   '#F48730',
  //   '#DB4281',
  //   '#7E84F4',
  //   '#78DF76',
  //   '#1C7AED',
  //   '#7129CD',
  //   '#E7C73B',
  //   '#C95F1E',
  //   '#188E61',
  //   '#BEE952',
  // ];
  const palette = schemeCategory10;
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

  const diseaseIdLookup = new Map();
  const diseaseGroups = new Map();
  for (const row of data) {
    const { id, name } = getTherapeuticArea(row);
    diseaseIdLookup.set(row, id);
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
  const xTickValues = [0];
  const xMidpoints = [];
  const sortedData = [];
  const sortedDiseaseNames = [];
  for (const id of sortedDiseaseIds) {
    const { name, data: newRows } = diseaseGroups.get(id);
    sortedDiseaseNames.push(name);
    newRows.sort((row1, row2) => pValue(row1) - pValue(row2));
    sortedData.push(...newRows);
    xTickValues.push(xTickValues.at(-1) + newRows.length);
    xMidpoints.push((xTickValues.at(-2) + xTickValues.at(-1)) / 2);
  }
  const xLookup = new Map(sortedData.map((d, i) => [d, i]));

  function xAnchor(row) {
    const x = xLookup.get(row);
    return x < xLookup.size / 2 ? 'left' : 'right';
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
          x: scaleLinear().domain([0, sortedData.length]),
          y: scaleLog().domain([pValueMin, pValueMax]),
          fill: colorScale,
          stroke: colorScale,
          shape: scaleOrdinal(['circle', 'triangle'], ['circle', 'triangle'])
        }}
      >
        <XTick values={xTickValues} tickLength={7} />
        {/* need to use different XLabel elements to use different colors */}
        {sortedDiseaseIds.map((id, i) => (
          <XLabel
            key={i}
            values={[xMidpoints[i]]}
            format={() => sortedDiseaseNames[i]}
            padding={3}
            textAnchor="start"
            style={{
              transformOrigin: '0% 50%',
              transformBox: 'fill-box',
              transform: "rotate(45deg)",
            }}
            fill={colorScale(id)}
          />
        )
        )}
        {/* <XGrid values={xTickValues} stroke="#e4e4e4" /> */}
        <XTitle fontSize={11} position="top" align="left" textAnchor="middle" padding={16} dx={-30}>
          <tspan fontStyle="italic">-log
            <tspan fontSize="9" dy="4">10</tspan>
            <tspan dy="-4">(pValue)</tspan>
          </tspan>
        </XTitle>
        <YTick />
        <YLabel format={v => -Math.log10(v)} />

        <Point
          x={(d, i) => i + 0.5}
          y={pValue}
          fill={d => d.variant.id === id ? diseaseIdLookup.get(d) : 'background'}
          stroke={d => diseaseIdLookup.get(d)}
          strokeWidth={1.3}
          area={pointArea}
          hover="stay"
          shape={d => d.beta ? 'triangle' : 'circle'}
          rotation={d => d.beta < 0 ? 180 : 0}
        />

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
        <Point
          dataFrom="hover"
          x={d => xLookup.get(d) + 0.5}
          y={pValue}
          fill={d => d.variant.id === id ? diseaseIdLookup.get(d) : 'background'}
          stroke={d => diseaseIdLookup.get(d)}
          strokeWidth={1.3}
          area={pointArea}
          hover="stay"
          shape={d => d.beta ? 'triangle' : 'circle'}
          rotation={d => d.beta < 0 ? 180 : 0}
        />
        {/* SOME TOOLTIP POSITIONS CURRENTLY WILDLY OFF ON THE X-AXIS */}
        <HTML
          dataFrom="hover"
          x={d => xLookup.get(d) + 0.5}
          y={pValue}
          pxWidth={290}
          pxHeight={200}
          content={d => <Tooltip data={d} />}
          anchor={d => `${yAnchor(d)}-${xAnchor(d)}`}
          pointerEvents="visiblePainted"
          dx={d => xAnchor(d) === 'left' ? 10 : -10}
          dy={d => yAnchor(d) === 'top' ? 10 : -10}
        />

        {/* axes at end so fade rectangle doesn't cover them */}
        <XAxis />
        <YAxis />

      </Plot>
    </Vis >
  );

}

function Tooltip({ data }) {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: "#fffc",
      borderColor: "#ddd",
      borderWidth: "1px",
      borderStyle: "solid",
      borderRadius: "0.2rem",
      padding: "0.25em 0.5rem",
    }}>
      {JSON.stringify(data)};
      {/* <table>
        <tbody>
          <TooltipRow label="Details">
            <Link to={`../credible-set/${data.studyLocusId}`}>view</Link>
          </TooltipRow>
          <TooltipRow label="Lead variant">
            <Link to={`/variant/${data.variant.id}`}>
              <DisplayVariantId
                variantId={data.variant.id}
                referenceAllele={data.variant.referenceAllele}
                alternateAllele={data.variant.alternateAllele}
                expand={false}
              />
            </Link>
          </TooltipRow>
          <TooltipRow label="P-value">
            <ScientificNotation number={[data.pValueMantissa, data.pValueExponent]} />
          </TooltipRow>
          <TooltipRow label="Beta">
            {data.beta?.toFixed(3) ?? naLabel}
          </TooltipRow>
          <TooltipRow label="Finemapping">
            {data.finemappingMethod ?? naLabel}
          </TooltipRow>
          {data.l2Gpredictions?.[0].target
            ? <TooltipRow label="Top L2G">
              <Link to={`/target/${data.l2Gpredictions?.[0].target.id}`}>
                {data.l2Gpredictions?.[0].target.approvedSymbol}
              </Link>
            </TooltipRow>
            : <TooltipRow label="Top L2G">
              {naLabel}
            </TooltipRow>
          }
          <TooltipRow label="L2G score">
            {data.l2Gpredictions?.[0].score.toFixed(3)}
          </TooltipRow>
          <TooltipRow label="Credible set size">
            {data.locus?.length ?? naLabel}
          </TooltipRow>
        </tbody>
      </table> */}
    </div>
  );
}

// function TooltipRow({ children, label }) {
//   return (
//     <tr>
//       <td>
//         <Typography variant="subtitle2" style={{ lineHeight: 1.35, paddingRight: "0.2rem" }}>
//           {label}:
//         </Typography>
//       </td>
//       <td>
//         <Typography variant="body2" style={{ lineHeight: 1.35 }}>
//           {children}
//         </Typography>
//       </td>
//     </tr>
//   );
// }

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