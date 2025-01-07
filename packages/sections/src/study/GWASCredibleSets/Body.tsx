import {
  Link,
  SectionItem,
  ScientificNotation,
  DisplayVariantId,
  Tooltip,
  ClinvarStars,
  OtScoreLinearBar,
  OtTable,
  useBatchQuery,
  Navigate,
} from "ui";
import { naLabel, credsetConfidenceMap, initialResponse, table5HChunkSize } from "../../constants";
import { definition } from ".";
import Description from "./Description";
import GWAS_CREDIBLE_SETS_QUERY from "./GWASCredibleSetsQuery.gql";
import {
  mantissaExponentComparator,
  nullishComparator,
  variantComparator,
} from "../../utils/comparators";
import ManhattanPlot from "./ManhattanPlot";
import { ReactElement, useEffect, useState } from "react";
import { responseType } from "ui/src/types/response";

const columns = [
  {
    id: "studyLocusId",
    label: "Navigate",
    renderCell: ({ studyLocusId }) => <Navigate to={`/credible-set/${studyLocusId}`} />,
  },
  {
    id: "leadVariant",
    label: "Lead variant",
    comparator: variantComparator(d => d?.variant),
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
    numeric: true,
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
      return <ScientificNotation number={[pValueMantissa, pValueExponent]} dp={2} />;
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
    numeric: true,
    sortable: true,
    tooltip: "Beta with respect to the ALT allele",
    renderCell: ({ beta }) => {
      if (typeof beta !== "number") return naLabel;
      return beta.toPrecision(3);
    },
  },
  {
    id: "finemappingMethod",
    label: "Fine-mapping method",
  },
  {
    id: "confidence",
    label: "Fine-mapping confidence",
    tooltip:
      "Fine-mapping confidence based on the quality of the linkage-desequilibrium information available and fine-mapping method",
    sortable: true,
    renderCell: ({ confidence }) => {
      if (!confidence) return naLabel;
      return (
        <Tooltip title={confidence} style="">
          <ClinvarStars num={credsetConfidenceMap[confidence]} />
        </Tooltip>
      );
    },
    filterValue: ({ confidence }) => credsetConfidenceMap[confidence],
  },
  {
    id: "topL2G",
    label: "Top L2G",
    filterValue: ({ l2GPredictions }) => l2GPredictions?.rows[0]?.target.approvedSymbol,
    tooltip: "Top gene prioritised by our locus-to-gene model",
    renderCell: ({ l2GPredictions }) => {
      const target = l2GPredictions?.rows[0]?.target;
      if (!target) return naLabel;
      return <Link to={`/target/${target.id}`}>{target.approvedSymbol}</Link>;
    },
    exportValue: ({ l2GPredictions }) => l2GPredictions?.rows[0]?.target.approvedSymbol,
  },
  {
    id: "l2gScore",
    label: "L2G score",
    comparator: nullishComparator(
      (a, b) => a - b,
      row => row?.l2GPredictions?.rows[0]?.score,
      false
    ),
    sortable: true,
    tooltip:
      "Machine learning prediction linking a gene to a credible set using all features. Score range [0,1].",
    renderCell: ({ l2GPredictions }) => {
      const score = l2GPredictions?.rows[0]?.score;
      if (typeof score !== "number") return naLabel;
      return (
        <Tooltip title={score.toFixed(3)} style="">
          <OtScoreLinearBar variant="determinate" value={score * 100} />
        </Tooltip>
      );
    },
    exportValue: ({ l2GPredictions }) => l2GPredictions?.rows[0]?.score,
  },
  {
    id: "credibleSetSize",
    label: "Credible set size",
    comparator: (a, b) => a.locus?.count - b.locus?.count,
    sortable: true,
    numeric: true,
    filterValue: false,
    renderCell: ({ locus }) => {
      return typeof locus?.count === "number" ? locus.count.toLocaleString() : naLabel;
    },
    exportValue: ({ locus }) => locus?.count,
  },
];

type BodyProps = {
  id: string;
  entity: string;
};

function Body({ id, entity }: BodyProps): ReactElement {
  const variables = {
    studyId: id,
    size: table5HChunkSize,
    index: 0,
  };

  const [request, setRequest] = useState<responseType>(initialResponse);

  const getData = useBatchQuery({
    query: GWAS_CREDIBLE_SETS_QUERY,
    variables,
    dataPath: "data.study.credibleSets",
    size: table5HChunkSize,
  });

  useEffect(() => {
    getData().then(r => {
      setRequest(r);
    });
  }, [id]);

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      loadingMessage="Loading data. This may take some time..."
      renderDescription={() => <Description studyId={request.data?.study.id} />}
      renderBody={() => (
        <>
          <ManhattanPlot loading={request.loading} data={request.data?.study.credibleSets.rows} />
          <OtTable
            dataDownloader
            showGlobalFilter
            sortBy="pValue"
            loading={request.loading}
            columns={columns}
            rows={request.data?.study.credibleSets.rows}
            query={GWAS_CREDIBLE_SETS_QUERY.loc.source.body}
            variables={variables}
          />
        </>
      )}
    />
  );
}

export default Body;
