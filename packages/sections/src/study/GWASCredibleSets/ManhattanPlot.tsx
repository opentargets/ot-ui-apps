import { Skeleton, useTheme } from "@mui/material";
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
  HTMLTooltip,
  HTMLTooltipTable,
  HTMLTooltipRow,
} from "ui";
import { scaleLinear, scaleLog, min } from "d3";
import { ScientificNotation } from "ui";
import { naLabel } from "../../constants";

export default function ManhattanPlot({ loading, data }) {

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
      d.variant != null;
  });
  if (data.length === 0) return null;

  const pValueMin = min(data, pValue);
  const pValueMax = 1;

  const genomePositions = {};
  data.forEach(({ variant }) => {
    genomePositions[variant.id] = cumulativePosition(variant);
  });

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
          x: scaleLinear().domain([0, genomeLength]),
          y: scaleLog().domain([pValueMin, pValueMax]),
        }}
        xTick={chromosomeInfo}
      >

        <XTick
          values={tickData => [0, ...tickData.map(chromo => chromo.end)]}
          tickLength={15}
        />
        <XLabel
          values={tickData => tickData.map(chromo => chromo.midpoint)}
          format={(_, i, __, tickData) => tickData[i].chromosome}
          padding={5}
        />
        <XGrid
          values={tickData => tickData.map(chromo => chromo.end)}
          stroke="#cecece"
          strokeDasharray="3 4"
        />
        <XTitle fontSize={11} position="top" align="left" textAnchor="middle" padding={16} dx={-30}>
          <tspan fontStyle="italic">-log
            <tspan fontSize="9" dy="4">10</tspan>
            <tspan dy="-4">(pValue)</tspan>
          </tspan>
        </XTitle>
        <YTick />
        <YLabel format={v => -Math.log10(v)} />

        <Segment
          x={d => genomePositions[d.variant.id]}
          xx={d => genomePositions[d.variant.id]}
          y={pValue}
          yy={pValueMax}
          stroke={markColor}
          strokeWidth={1}
          strokeOpacity={0.7}
          hover="stay"
        />
        <Circle
          x={d => genomePositions[d.variant.id]}
          y={pValue}
          fill={background}
          stroke={markColor}
          strokeWidth={1.2}
          area={circleArea}
          hover="stay"
        />

        {/* on hover */}
        <Rect
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
        <HTMLTooltip
          x={d => genomePositions[d.variant.id]}
          y={pValue}
          pxWidth={290}
          pxHeight={200}
          content={tooltipContent}
        />

        {/* axes at end so fade rectangle doesn't cover them */}
        <XAxis />
        <YAxis />

      </Plot>
    </Vis>
  );

}

function tooltipContent(data) {
  return (
    <HTMLTooltipTable>
      <HTMLTooltipRow label="Details" data={data}>
        <Link to={`../credible-set/${data.studyLocusId}`}>view</Link>
      </HTMLTooltipRow>
      <HTMLTooltipRow label="Lead variant" data={data}>
        <Link to={`/variant/${data.variant.id}`}>
          <DisplayVariantId
            variantId={data.variant.id}
            referenceAllele={data.variant.referenceAllele}
            alternateAllele={data.variant.alternateAllele}
            expand={false}
          />
        </Link>
      </HTMLTooltipRow>
      <HTMLTooltipRow label="P-value" data={data}>
        <ScientificNotation number={[data.pValueMantissa, data.pValueExponent]} />
      </HTMLTooltipRow>
      <HTMLTooltipRow label="Beta" data={data}>
        {data.beta?.toFixed(3) ?? naLabel}
      </HTMLTooltipRow>
      <HTMLTooltipRow label="Fine-mapping" data={data}>
        {data.finemappingMethod ?? naLabel}
      </HTMLTooltipRow>
      {data.l2Gpredictions?.[0]?.target
        ? <HTMLTooltipRow label="Top L2G" data={data}>
          <Link to={`/target/${data.l2Gpredictions[0].target.id}`}>
            {data.l2Gpredictions[0].target.approvedSymbol}
          </Link>
        </HTMLTooltipRow>
        : <HTMLTooltipRow label="Top L2G">
          {naLabel}
        </HTMLTooltipRow>
      }
      <HTMLTooltipRow label="L2G score" data={data}>
        {data.l2Gpredictions?.[0]?.score != null
          ? data.l2Gpredictions[0].score.toFixed(3)
          : naLabel
        }
      </HTMLTooltipRow>
      <HTMLTooltipRow label="Credible set size" data={data}>
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

// from: https://www.ncbi.nlm.nih.gov/grc/human/data
// (first tab: "Chromosome lengths")
const chromosomeInfo = [
  { chromosome: '1', length: 248956422 },
  { chromosome: '2', length: 242193529 },
  { chromosome: '3', length: 198295559 },
  { chromosome: '4', length: 190214555 },
  { chromosome: '5', length: 181538259 },
  { chromosome: '6', length: 170805979 },
  { chromosome: '7', length: 159345973 },
  { chromosome: '8', length: 145138636 },
  { chromosome: '9', length: 138394717 },
  { chromosome: '10', length: 133797422 },
  { chromosome: '11', length: 135086622 },
  { chromosome: '12', length: 133275309 },
  { chromosome: '13', length: 114364328 },
  { chromosome: '14', length: 107043718 },
  { chromosome: '15', length: 101991189 },
  { chromosome: '16', length: 90338345 },
  { chromosome: '17', length: 83257441 },
  { chromosome: '18', length: 80373285 },
  { chromosome: '19', length: 58617616 },
  { chromosome: '20', length: 64444167 },
  { chromosome: '21', length: 46709983 },
  { chromosome: '22', length: 50818468 },
  { chromosome: 'X', length: 156040895 },
  { chromosome: 'Y', length: 57227415 },
];

chromosomeInfo.forEach((chromo, i) => {
  chromo.start = chromosomeInfo[i - 1]?.end ?? 0;
  chromo.end = chromo.start + chromo.length;
  chromo.midpoint = (chromo.start + chromo.end) / 2;
});

const genomeLength = chromosomeInfo.at(-1).end;

const chromosomeInfoMap = new Map(
  chromosomeInfo.map(obj => [obj.chromosome, obj])
);

function cumulativePosition({ chromosome, position }) {
  return chromosomeInfoMap.get(chromosome).start + position;
}