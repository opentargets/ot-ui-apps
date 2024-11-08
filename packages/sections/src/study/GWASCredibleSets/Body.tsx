import { useQuery } from "@apollo/client";
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
import * as d3 from "d3";

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
          <ManhattanPlot data={request.data?.gwasStudy[0].credibleSets} />
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

// currently inefficient since finds correct chromosome
function cumulativePosition({ chromosome, position }) {
  return chromosomeInfo.find(elmt => elmt.chromosome === chromosome).start + position;
}

function pValue(row) {
  return row.pValueMantissa * 10 ** row.pValueExponent;
}

function ManhattanPlot({ data }) {

  if (data == null) return null;

  const genomePositions = {};
  data.forEach(({ variant }) => {
    genomePositions[variant.id] = cumulativePosition(variant);
  });

  const pValueMin = d3.min(data, pValue);
  const pValueMax = 1;

  const background = '#fff';
  const markColor = '#3489ca';

  return (
    <Plot
      responsive
      height="360"
      padding={{ top: 40, right: 10, bottom: 40, left: 80 }}
      data={data}
      yReverse
      scales={{
        x: d3.scaleLinear().domain([0, genomeLength]),
        y: d3.scaleLog().domain([pValueMin, pValueMax]),
      }}
      xTick={chromosomeInfo}
    >
      <XTick
        values={tickData => tickData.map(chromo => chromo.start)} tickLength={15}/>
      <XAxis />
      <XLabel 
        values={tickData => tickData.map(chromo => chromo.midpoint)}
        format={(_, i, __, tickData) => tickData[i].chromosome}
        padding={6}
      />
      <XGrid values={tickData => tickData.map(chromo => chromo.start)} stroke="#cecece" strokeDasharray="3 4"/>
      <XTitle fontSize={10} position="top" align="left" textAnchor="end" padding={14}>
        -log_10(pValue)
      </XTitle>
      <YAxis />
      <YTick />
      <YLabel format={v => -Math.log10(v)} />
      <Segment
        x={d => genomePositions[d.variant.id]}
        xx={d => genomePositions[d.variant.id]}
        y={pValue}
        yy={pValueMax}
        fill="transparent"
        stroke={markColor}
        strokeWidth={1}
        strokeOpacity={0.7}
        area={24}
      />
      <Circle
        x={d => genomePositions[d.variant.id]}
        y={pValue}
        fill={background}
        fillOpacity={1}
        stroke={markColor}
        strokeWidth={1.2}
        area={24}
      />
    </Plot>
  );
}


// ========== chromosome lengths ==========

// !! MOVE THIS TO A DIFFERENT FILE WHEN DONE !!
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

// const cumulativeLengths = [...d3.cumsum(chromosomeInfo, d => d.length)];
chromosomeInfo.forEach((chromo, i) => {
  chromo.start = chromosomeInfo[i-1]?.end ?? 0;
  chromo.end = chromo.start + chromo.length;
  chromo.midpoint = (chromo.start + chromo.end) / 2;
});

const genomeLength = chromosomeInfo.at(-1).end;



/* ========== TO DO ============================================================
- orob want plot title e.g. "pValue and position of lead variant of each creidble set"
- only import d3 functions that need
- use subscript for log_10 in x-title
- show skeleton when plot loading?
- does Manhattan plot need extra props such as loading?
  - poss abstract into a PlotWrapper component? - careful as I think already a
    component called this in the platform
- need to filter data in case no lead variant - cred set shold always have a lead var?
- ignore data that uses chromo 23 or 24 - see dochoa slack 7/11/24
- ignore data with no pValue - need to check at top level and within variant?
- properly handle removal of strongestLocusToGene in table in separate PR
*/