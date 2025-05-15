import {
  Link,
  SectionItem,
  DisplayVariantId,
  ScientificNotation,
  OtTable,
  Tooltip,
  useBatchQuery,
  Navigate,
} from "ui";
import { naLabel, table5HChunkSize } from "@ot/constants";
import { definition } from ".";
import Description from "./Description";
import GWAS_COLOC_QUERY from "./GWASColocQuery.gql";
import { mantissaExponentComparator, variantComparator, getStudyCategory } from "@ot/utils";
import { ReactElement } from "react";

const columns = [
  {
    id: "otherStudyLocus.studyLocusId",
    label: "Credible set",
    enableHiding: false,
    sticky: true,
    renderCell: ({ otherStudyLocus }) => {
      if (!otherStudyLocus?.variant) return naLabel;
      return <Navigate to={`/credible-set/${otherStudyLocus.studyLocusId}`} />;
    },
  },
  {
    id: "otherStudyLocus.study.id",
    label: "Study",
    renderCell: ({ otherStudyLocus }) => {
      const studyId = otherStudyLocus?.study?.id;
      if (!studyId) return naLabel;
      return (
        <Link asyncTooltip to={`../study/${studyId}`}>
          {studyId}
        </Link>
      );
    },
  },
  {
    id: "otherStudyLocus.study.traitFromSource",
    label: "Reported trait",
    renderCell: ({ otherStudyLocus }) => {
      const trait = otherStudyLocus?.study?.traitFromSource;
      if (!trait) return naLabel;
      return trait;
    },
  },
  {
    id: "otherStudyLocus.study.publicationFirstAuthor",
    label: "First author",
    renderCell: ({ otherStudyLocus }) => {
      const { projectId, publicationFirstAuthor } = otherStudyLocus?.study || {};
      return getStudyCategory(projectId) === "FINNGEN"
        ? "FinnGen"
        : publicationFirstAuthor || naLabel;
    },
    exportValue: ({ otherStudyLocus }) => {
      return otherStudyLocus?.study?.publicationFirstAuthor;
    },
  },
  {
    id: "otherStudyLocus.variant.id",
    label: "Lead Variant",
    comparator: variantComparator(d => d?.otherStudyLocus?.variant),
    sortable: true,
    filterValue: ({ otherStudyLocus }) => {
      const v = otherStudyLocus?.variant;
      return `${v?.chromosome}_${v?.position}_${v?.referenceAllele}_${v?.alternateAllele}`;
    },
    renderCell: ({ otherStudyLocus }) => {
      if (!otherStudyLocus?.variant) return naLabel;
      const { id: variantId, referenceAllele, alternateAllele } = otherStudyLocus.variant;
      return (
        <Link asyncTooltip to={`/variant/${variantId}`}>
          <DisplayVariantId
            variantId={variantId}
            referenceAllele={referenceAllele}
            alternateAllele={alternateAllele}
            expand={false}
          />
        </Link>
      );
    },
    exportValue: ({ otherStudyLocus }) => otherStudyLocus?.variant?.id,
  },
  {
    id: "pValue",
    label: "P-Value",
    numeric: true,
    comparator: ({ otherStudyLocus: a }, { otherStudyLocus: b }) =>
      mantissaExponentComparator(
        a?.pValueMantissa,
        a?.pValueExponent,
        b?.pValueMantissa,
        b?.pValueExponent
      ),
    sortable: true,
    filterValue: false,
    renderCell: ({ otherStudyLocus }) => {
      const { pValueMantissa, pValueExponent } = otherStudyLocus ?? {};
      if (typeof pValueMantissa !== "number" || typeof pValueExponent !== "number") return naLabel;
      return <ScientificNotation number={[pValueMantissa, pValueExponent]} dp={2} />;
    },
    exportValue: ({ otherStudyLocus }) => {
      const { pValueMantissa, pValueExponent } = otherStudyLocus ?? {};
      if (typeof pValueMantissa !== "number" || typeof pValueExponent !== "number") return null;
      return `${pValueMantissa}x10${pValueExponent}`;
    },
  },
  {
    id: "numberColocalisingVariants",
    label: "Colocalising Variants (n)",
    numeric: true,
    filterValue: false,
    comparator: (a, b) => a?.numberColocalisingVariants - b?.numberColocalisingVariants,
    renderCell: ({ numberColocalisingVariants }) => {
      return typeof numberColocalisingVariants === "number"
        ? numberColocalisingVariants.toLocaleString()
        : naLabel;
    },
    sortable: true,
  },
  {
    id: "colocalisationMethod",
    label: "Colocalisation Method",
  },
  {
    id: "betaRatioSignAverage",
    label: "Directionality",
    tooltip: "Effect directionality based on the ratio of betas between the two credible sets",
    renderCell: ({ betaRatioSignAverage }) => {
      if (betaRatioSignAverage == null) return naLabel;
      let category = "Inconclusive";
      if (betaRatioSignAverage <= -0.99) category = "Opposite";
      else if (betaRatioSignAverage >= 0.99) category = "Same";
      const displayValue =
        Math.abs(betaRatioSignAverage) === 1
          ? betaRatioSignAverage
          : betaRatioSignAverage.toFixed(2);
      return <Tooltip title={`Beta ratio sign average: ${displayValue}`}>{category}</Tooltip>;
    },
    filterValue: ({ betaRatioSignAverage }) => {
      if (betaRatioSignAverage == null) return null;
      if (betaRatioSignAverage <= -0.99) return "Opposite";
      else if (betaRatioSignAverage >= 0.99) return "Same";
      return "Inconclusive";
    },
    sortable: false,
    exportValue: ({ betaRatioSignAverage }) => {
      if (betaRatioSignAverage == null) return null;
      if (betaRatioSignAverage <= -0.99) return "Opposite";
      else if (betaRatioSignAverage >= 0.99) return "Same";
      return "Inconclusive";
    },
  },
  {
    id: "h3",
    label: "H3",
    numeric: true,
    tooltip: (
      <>
        Posterior probability that the signals <b>do not</b> colocalise
      </>
    ),
    filterValue: false,
    comparator: (a, b) => a?.h3 - b?.h3,
    sortable: true,
    renderCell: ({ h3 }) => {
      if (typeof h3 !== "number") return naLabel;
      return h3.toFixed(3);
    },
  },
  {
    id: "h4",
    label: "H4",
    numeric: true,
    tooltip: "Posterior probability that the signals colocalise",
    filterValue: false,
    comparator: (a, b) => a?.h4 - b?.h4,
    sortable: true,
    renderCell: ({ h4 }) => {
      if (typeof h4 !== "number") return naLabel;
      return h4.toFixed(3);
    },
  },
  {
    id: "clpp",
    label: "CLPP",
    tooltip:
      "The sum of the products of the fine-mapping posterior probabilities for overlapping variants between two study loci",
    numeric: true,
    filterValue: false,
    comparator: (a, b) => a?.clpp - b?.clpp,
    sortable: true,
    renderCell: ({ clpp }) => {
      if (typeof clpp !== "number") return naLabel;
      return clpp.toFixed(3);
    },
  },
];

type BodyProps = {
  studyLocusId: string;
  entity: string;
};

function Body({ studyLocusId, entity }: BodyProps): ReactElement {
  const variables = {
    studyLocusId: studyLocusId,
    size: table5HChunkSize,
    index: 0,
  };

  const request = useBatchQuery({
    query: GWAS_COLOC_QUERY,
    variables,
    dataPath: "credibleSet.colocalisation",
    size: table5HChunkSize,
  });

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      renderDescription={() => <Description />}
      showContentLoading
      loadingMessage="Loading data. This may take some time..."
      renderBody={() => {
        return (
          <OtTable
            dataDownloader
            showGlobalFilter
            dataDownloaderFileStem={`${studyLocusId}-credibleSets`}
            sortBy="pValue"
            order="asc"
            columns={columns}
            loading={request.loading}
            rows={request.data?.credibleSet.colocalisation.rows}
            query={GWAS_COLOC_QUERY.loc.source.body}
            variables={variables}
          />
        );
      }}
    />
  );
}

export default Body;
