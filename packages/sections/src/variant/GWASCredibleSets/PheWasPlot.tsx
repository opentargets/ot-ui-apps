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
  Segment,
  Rect,
  HTML,
} from "ui";
import { scaleLinear, scaleLog, min, scaleOrdinal } from "d3";
import { ScientificNotation } from "ui";
import { naLabel } from "../../constants";
import { groupBy } from "lodash";

export default function PheWasPlot({ loading, data, id }) {

  const plotHeight = 440;
  const theme = useTheme();
  const background = theme.palette.background.paper;
  const markColor = theme.palette.primary.main;
  const fontFamily = theme.typography.fontFamily;
  const circleArea = 36;

  if (loading) return <Skeleton height={plotHeight} />;
  if (data == null) return null;

  // eslint-disable-next-line
  data = data.filter(d => {
    return d.pValueMantissa != null &&
      d.pValueExponent != null &&
      d.variant != null &&
      d?.study?.diseases?.length;
  });
  if (data.length === 0) return null;

  const pValueMin = min(data, pValue);
  const pValueMax = 1;

  const diseaseGroups = new Map();  // each row has a point for each of its diseases
  for (const row of data) {
    for (const { id, name } of row.study.diseases) {
      diseaseGroups.has(id)
        ? diseaseGroups.get(id).data.push(row)
        : diseaseGroups.set(id, { name, data: [row] });
    }
  }
  const sortedDiseaseIds =  // disease ids sorted by disease name
    [...diseaseGroups]
      .sort((a, b) => a[1].name.localeCompare(b[1].name))
      .map(a => a[0]);
  const xTickValues = [0];
  const xMidpoints = [];
  const sortedData = [];
  const sortedDiseaseNames = [];
  for (const id of sortedDiseaseIds) {
    const { name, data: newRows } = diseaseGroups.get(id);
    sortedDiseaseNames.push(name);
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
          fill: scaleOrdinal(['background', 'markColor'], [background, markColor]),
        }}
      >
        <XTick values={xTickValues} tickLength={10} />
        <XLabel
          values={xMidpoints}
          format={(v, i) => sortedDiseaseNames[i]}
          padding={5}
          textAnchor="start"
          style={{
            transformOrigin: '0% 50%',
            transformBox: 'fill-box',
            transform: "rotate(45deg)",
          }}
        />
        <XGrid values={xTickValues} stroke="#cecece" strokeDasharray="3 4" />
        <XTitle fontSize={11} position="top" align="left" textAnchor="middle" padding={16} dx={-30}>
          <tspan fontStyle="italic">-log
            <tspan fontSize="9" dy="4">10</tspan>
            <tspan dy="-4">(pValue)</tspan>
          </tspan>
        </XTitle>
        <YTick />
        <YLabel format={v => -Math.log10(v)} />

        <Circle
          x={(d, i) => i + 0.5}
          y={pValue}
          fill={d => d.variant.id === id ? markColor : background}
          stroke={markColor}
          strokeWidth={1.3}
          area={circleArea}
          hover="stay"
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
        <Circle
          dataFrom="hover"
          x={d => xLookup.get(d) + 0.5}
          y={pValue}
          fill={d => d.variant.id === id ? markColor : background}
          stroke={markColor}
          strokeWidth={1.2}
          area={circleArea}
        />
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