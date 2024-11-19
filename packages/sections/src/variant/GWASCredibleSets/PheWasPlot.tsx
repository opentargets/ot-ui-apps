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
import { scaleLinear, scaleLog, min } from "d3";
import { ScientificNotation } from "ui";
import { naLabel } from "../../constants";
// import { group } from "d3";
// import * as d3 from "d3";
import { groupBy } from "lodash";

// window.d3 = d3
// debugger

export default function PheWasPlot({ loading, data }) {

  const plotHeight = 390;
  const theme = useTheme();
  const background = theme.palette.background.paper;
  const markColor = theme.palette.primary.main;
  const fontFamily = theme.typography.fontFamily;
  const circleArea = 32;

  if (loading) return <Skeleton height={plotHeight} />;
  if (data == null) return null;

  // eslint-disable-next-line
  data = data.filter(d => {
    return d.pValueMantissa != null &&
      d.pValueExponent != null &&
      d.variant != null &&
      d?.study?.traitFromSource;
  });
  if (data.length === 0) return null;

  const pValueMin = min(data, pValue);
  const pValueMax = 1;

  // const diseaseGroups = group(data => data.study.traitFromSource); 
  // const sortedDiseases = [...diseaseGroups.keys()]
  //   .map(key => key.toLowerCase())
  //   .sort();
  // const xLookup = new Map();
  // const xTickValues = [0];
  // const xMidpoints = new Map();
  // for (let disease of sortedDiseases) {
  //   for (let variant of diseaseGroups.get(disease)) {
  //     xLookup.set(variant.id, xLookup.size);
  //   }
  //   xTickValues.push(xLookup.size);
  //   xMidpoints.set(disease, ((xTickValues.at(-1) ?? 0) + xLookup.size) / 2);
  // }

  const diseaseGroups = groupBy(data, d => d.study.traitFromSource);
  const sortedDiseases = Object.keys(diseaseGroups)
    .map(key => key.toLowerCase())
    .sort();
  const xLookup = new Map();
  const xTickValues = [0];
  const xMidpoints = new Map();
  for (const disease of sortedDiseases) {
    for (const variant of diseaseGroups[disease]) {
      xLookup.set(variant.id, xLookup.size);
    }
    xTickValues.push(xLookup.size);
    xMidpoints.set(disease, ((xTickValues.at(-1) ?? 0) + xLookup.size) / 2);
  }

  function xAnchor(row) {
    const x = genomePositions[row.variant.id];
    return x < genomeLength / 2 ? 'left' : 'right';
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
        padding={{ top: 50, right: 40, bottom: 50, left: 90 }}
        fontFamily={fontFamily}
        data={data}
        yReverse
        scales={{
          x: scaleLinear().domain([0, xGlobal.size]),
          y: scaleLog().domain([pValueMin, pValueMax]),
        }}
      >
        <XTick values={xTickValues} tickLength={15} />
        <XLabel
          values={[...xMidpoints.keys()]}
          format={disease => xMidpoints.get(disease)}
          padding={5}
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
          x={d => xLookup.get(d.variant.id)}
          y={pValue}
          fill={background}
          stroke={markColor}
          strokeWidth={1.2}
          area={circleArea}
        // hover="stay"
        />

        {/* on hover */}
        {/* <Rect
          dataFrom="hover"
          x={0}
          xx={genomeLength}
          dxx={8}
          y={pValueMin}
          yy={pValueMax}
          dy={-8}
          dyy={0}
          fill={background}
          fillOpacity={0.4}
        />
        <Segment
          dataFrom="hover"
          x={d => genomePositions[d.variant.id]}
          xx={d => genomePositions[d.variant.id]}
          y={pValue}
          yy={pValueMax}
          stroke={markColor}
          strokeWidth={1.7}
          strokeOpacity={1}
        />
        <Circle
          dataFrom="hover"
          x={d => genomePositions[d.variant.id]}
          y={pValue}
          fill={markColor}
          area={circleArea}
        />
        <HTML
          dataFrom="hover"
          x={d => genomePositions[d.variant.id]}
          y={pValue}
          pxWidth={290}
          pxHeight={200}
          content={d => <Tooltip data={d} />}
          anchor={d => `${yAnchor(d)}-${xAnchor(d)}`}
          pointerEvents="visiblePainted"
          dx={d => xAnchor(d) === 'left' ? 10 : -10}
          dy={d => yAnchor(d) === 'top' ? 10 : -10}
        /> */}

        {/* axes at end so fade rectangle doesn't cover them */}
        <XAxis />
        <YAxis />

      </Plot>
    </Vis >
  );

}

// function Tooltip({ data }) {
//   return (
//     <div style={{
//       width: "100%",
//       height: "100%",
//       background: "#fffc",
//       borderColor: "#ddd",
//       borderWidth: "1px",
//       borderStyle: "solid",
//       borderRadius: "0.2rem",
//       padding: "0.25em 0.5rem",
//     }}>
//       <table>
//         <tbody>
//           <TooltipRow label="Details">
//             <Link to={`../credible-set/${data.studyLocusId}`}>view</Link>
//           </TooltipRow>
//           <TooltipRow label="Lead variant">
//             <Link to={`/variant/${data.variant.id}`}>
//               <DisplayVariantId
//                 variantId={data.variant.id}
//                 referenceAllele={data.variant.referenceAllele}
//                 alternateAllele={data.variant.alternateAllele}
//                 expand={false}
//               />
//             </Link>
//           </TooltipRow>
//           <TooltipRow label="P-value">
//             <ScientificNotation number={[data.pValueMantissa, data.pValueExponent]} />
//           </TooltipRow>
//           <TooltipRow label="Beta">
//             {data.beta?.toFixed(3) ?? naLabel}
//           </TooltipRow>
//           <TooltipRow label="Finemapping">
//             {data.finemappingMethod ?? naLabel}
//           </TooltipRow>
//           {data.l2Gpredictions?.[0].target
//             ? <TooltipRow label="Top L2G">
//               <Link to={`/target/${data.l2Gpredictions?.[0].target.id}`}>
//                 {data.l2Gpredictions?.[0].target.approvedSymbol}
//               </Link>
//             </TooltipRow>
//             : <TooltipRow label="Top L2G">
//               {naLabel}
//             </TooltipRow>
//           }
//           <TooltipRow label="L2G score">
//             {data.l2Gpredictions?.[0].score.toFixed(3)}
//           </TooltipRow>
//           <TooltipRow label="Credible set size">
//             {data.locus?.length ?? naLabel}
//           </TooltipRow>
//         </tbody>
//       </table>
//     </div>
//   );
// }

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
  return row.pValueMantissa * 10 ** row.pValueExponent;
}