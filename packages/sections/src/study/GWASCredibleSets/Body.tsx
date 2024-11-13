import { useQuery } from "@apollo/client";
import { Skeleton, useTheme } from "@mui/material";
import {
  Link,
  SectionItem,
  ScientificNotation,
  DisplayVariantId,
  OtTable,
  Plot,
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
} from "ui";
import { naLabel } from "../../constants";
import { definition } from ".";
import Description from "./Description";
import GWAS_CREDIBLE_SETS_QUERY from "./GWASCredibleSetsQuery.gql";
import { mantissaExponentComparator, variantComparator } from "../../utils/comparators";
import { scaleLinear, scaleLog, min } from "d3";

const columns = [
  {
    id: "view",
    label: "Details",
    renderCell: ({ studyLocusId }) => <Link to={`../credible-set/${studyLocusId}`}>view</Link>,
    filterValue: false,
    exportValue: false,
  },
  {
    id: "leadVariant",
    label: "Lead variant",
    comparator: variantComparator,
    sortable: true,
    filterValue: ({ variant: v }) =>
      `${v?.chromosome}_${v?.position}_${v?.referenceAllele}_${v?.alternateAllele}`,
    renderCell: ({ variant }) => {
      if (!variant) return naLabel;
      const { id: variantId, referenceAllele, alternateAllele } = variant;
      return (
        <Link to={`/variant/${variantId}`}>
          <DisplayVariantId
            variantId={variantId}
            referenceAllele={referenceAllele}
            alternateAllele={alternateAllele}
            expand={false}
          />
        </Link>
      );
    },
    exportValue: ({ variant }) => variant?.id,
  },
  {
    id: "pValue",
    label: "P-value",
    comparator: (a, b) =>
      mantissaExponentComparator(
        a?.pValueMantissa,
        a?.pValueExponent,
        b?.pValueMantissa,
        b?.pValueExponent
      ),
    sortable: true,
    filterValue: false,
    renderCell: ({ pValueMantissa, pValueExponent }) => {
      if (typeof pValueMantissa !== "number" || typeof pValueExponent !== "number") return naLabel;
      return <ScientificNotation number={[pValueMantissa, pValueExponent]} />;
    },
    exportValue: ({ pValueMantissa, pValueExponent }) => {
      if (typeof pValueMantissa !== "number" || typeof pValueExponent !== "number") return null;
      return `${pValueMantissa}x10${pValueExponent}`;
    },
  },
  {
    id: "beta",
    label: "Beta",
    filterValue: false,
    tooltip: "Beta with respect to the ALT allele",
    renderCell: ({ beta }) => {
      if (typeof beta !== "number") return naLabel;
      return beta.toPrecision(3);
    },
  },

  {
    id: "finemappingMethod",
    label: "Finemapping method",
  },
  // {
  //   id: "topL2G",
  //   label: "Top L2G",
  //   tooltip: "Top gene prioritised by our locus-to-gene model",
  //   filterValue: ({ strongestLocus2gene }) => strongestLocus2gene?.target.approvedSymbol,
  //   renderCell: ({ strongestLocus2gene }) => {
  //     if (!strongestLocus2gene?.target) return naLabel;
  //     const { target } = strongestLocus2gene;
  //     return <Link to={`/target/${target.id}`}>{target.approvedSymbol}</Link>;
  //   },
  //   exportValue: ({ strongestLocus2gene }) => strongestLocus2gene?.target.approvedSymbol,
  // },
  // {
  //   id: "l2gScore",
  //   label: "L2G score",
  //   comparator: (rowA, rowB) => rowA?.strongestLocus2gene?.score - rowB?.strongestLocus2gene?.score,
  //   sortable: true,
  //   filterValue: false,
  //   renderCell: ({ strongestLocus2gene }) => {
  //     if (typeof strongestLocus2gene?.score !== "number") return naLabel;
  //     return strongestLocus2gene.score.toFixed(3);
  //   },
  //   exportValue: ({ strongestLocus2gene }) => strongestLocus2gene?.score,
  // },
  {
    id: "credibleSetSize",
    label: "Credible set size",
    comparator: (a, b) => a.locus?.length - b.locus?.length,
    sortable: true,
    filterValue: false,
    renderCell: ({ locus }) => locus?.length ?? naLabel,
    exportValue: ({ locus }) => locus?.length,
  },
];

type BodyProps = {
  id: string;
  entity: string;
};

function Body({ id, entity }: BodyProps) {
  const variables = {
    studyId: id,
  };

  const request = useQuery(GWAS_CREDIBLE_SETS_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      renderDescription={() => <Description studyId={request.data?.gwasStudy[0].studyId} />}
      renderBody={() => (
        <>
          <ManhattanPlot
            loading={request.loading}
            data={request.data?.gwasStudy[0].credibleSets}
          />
          <OtTable
            dataDownloader
            showGlobalFilter
            sortBy="pValue"
            loading={request.loading}
            columns={columns}
            rows={request.data?.gwasStudy[0].credibleSets}
            query={GWAS_CREDIBLE_SETS_QUERY.loc.source.body}
            variables={variables}
          />
        </>
      )}
    />
  );
}

export default Body;


// =============================================================================

// ========== Manhattan plot ==========

function pValue(row) {
  return row.pValueMantissa * 10 ** row.pValueExponent;
}

function ManhattanPlot({ loading, data }) {
  
  const plotHeight = 370;
  const theme = useTheme();
  const background = theme.palette.background.paper;
  const markColor = theme.palette.primary.main;
  const fontFamily = theme.typography.fontFamily;
  const circleArea = 24;

  if (loading) return <Skeleton height={plotHeight} />;
  if (data == null) return null;

  const pValueMin = min(data, pValue);
  const pValueMax = 1;

  const genomePositions = {};
  data.forEach(({ variant }) => {
    genomePositions[variant.id] = cumulativePosition(variant);
  });

  return (
    <Plot
      responsive
      height={plotHeight}
      padding={{ top: 50, right: 40, bottom: 40, left: 90 }}
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
      <XAxis />
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
      <YAxis />
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
      />
      <Circle
        x={d => genomePositions[d.variant.id]}
        y={pValue}
        fill={background}
        stroke={markColor}
        strokeWidth={1.2}
        area={circleArea}
      />
    </Plot>
  );
}


// ========== chromosome lengths ==========

// from: https://www.ncbi.nlm.nih.gov/grc/human/data
// (first tab: "Chromosome lengths")
const chromosomeInfo = [
  { chromosome: '1',  length: 248956422 },
  { chromosome: '2',	length: 242193529 },
  { chromosome: '3',	length: 198295559 },
  { chromosome: '4',	length: 190214555 },
  { chromosome: '5',	length: 181538259 },
  { chromosome: '6',	length: 170805979 },
  { chromosome: '7',	length: 159345973 },
  { chromosome: '8',	length: 145138636 },
  { chromosome: '9',  length: 138394717 },
  { chromosome: '10',	length: 133797422 },
  { chromosome: '11',	length: 135086622 },
  { chromosome: '12',	length: 133275309 },
  { chromosome: '13',	length: 114364328 },
  { chromosome: '14',	length: 107043718 },
  { chromosome: '15',	length: 101991189 },
  { chromosome: '16',	length: 90338345  },
  { chromosome: '17',	length: 83257441  },
  { chromosome: '18',	length: 80373285  },
  { chromosome: '19',	length: 58617616  },
  { chromosome: '20',	length: 64444167  },
  { chromosome: '21',	length: 46709983  },
  { chromosome: '22',	length: 50818468  },
  { chromosome: 'X',	length: 156040895 },
  { chromosome: 'Y',  length: 57227415  },
];

chromosomeInfo.forEach((chromo, i) => {
  chromo.start = chromosomeInfo[i-1]?.end ?? 0;
  chromo.end = chromo.start + chromo.length;
  chromo.midpoint = (chromo.start + chromo.end) / 2;
});

const genomeLength = chromosomeInfo.at(-1).end;

const chromosomeInfoMap = new Map(
  chromosomeInfo.map(obj => [ obj.chromosome, obj ])
);

function cumulativePosition({ chromosome, position }) {
  return chromosomeInfoMap.get(chromosome).start + position;
}

