import { useQuery } from "@apollo/client";
import {
  Link,
  SectionItem,
  DisplayVariantId,
  ScientificNotation,
  OtTable,
  Tooltip,
  Navigate,
} from "ui";
import { naLabel } from "../../constants";
import { definition } from ".";
import Description from "./Description";
import MOLQTL_COLOC_QUERY from "./MolQTLColocQuery.gql";
import { mantissaExponentComparator, variantComparator } from "../../utils/comparators";
import { getStudyCategory } from "../../utils/getStudyCategory";

const columns = [
  {
    id: "otherStudyLocus.studyLocusId",
    label: "Navigate",
    renderCell: ({ otherStudyLocus }) => {
      if (!otherStudyLocus?.variant) return naLabel;
      return <Navigate to={`./${otherStudyLocus.studyLocusId}`} />;
    },
  },
  {
    id: "otherStudyLocus.study.id",
    label: "Study",
    renderCell: ({ otherStudyLocus }) => {
      const studyId = otherStudyLocus?.study?.id;
      if (!studyId) return naLabel;
      return <Link to={`../study/${studyId}`}>{studyId}</Link>;
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
      const { projectId, publicationFirstAuthor } = otherStudyLocus.study || {};
      getStudyCategory(projectId) === "FINNGEN" ? "FinnGen" : publicationFirstAuthor;
    },
  },
  {
    id: "otherStudyLocus.study.studyType",
    label: "Affected tissue/cell",
    renderCell: ({ otherStudyLocus }) => {
      const biosample = otherStudyLocus?.study?.biosample;
      if (!biosample) return naLabel;
      return <Link to={`../study/${biosample.biosampleId}`}>{biosample.name}</Link>;
    },
  },
  {
    id: "otherStudyLocus.study.studyType",
    label: "QTL type",
    renderCell: ({ otherStudyLocus }) => {
      const studyType = otherStudyLocus?.study?.studyType;
      if (!studyType) return naLabel;
      return studyType;
    },
  },
  {
    id: "otherStudyLocus.variant.id",
    label: "Lead Variant",
    comparator: variantComparator,
    sortable: true,
    filterValue: ({ otherStudyLocus }) => {
      const v = otherStudyLocus?.variant;
      return `${v?.chromosome}_${v?.position}_${v?.referenceAllele}_${v?.alternateAllele}`;
    },
    renderCell: ({ otherStudyLocus }) => {
      if (!otherStudyLocus?.variant) return naLabel;
      const { id: variantId, referenceAllele, alternateAllele } = otherStudyLocus.variant;
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
    exportValue: ({ otherStudyLocus }) => otherStudyLocus?.variant?.id,
  },
  {
    id: "pValue",
    label: "P-Value",
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
      return <ScientificNotation number={[pValueMantissa, pValueExponent]} />;
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
    filterValue: false,
    comparator: (a, b) => a?.numberColocalisingVariants - b?.numberColocalisingVariants,
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
      return h3.toPrecision(3);
    },
  },
  {
    id: "h4",
    label: "H4",
    tooltip: "Posterior probability that the signals colocalise",
    filterValue: false,
    comparator: (a, b) => a?.h4 - b?.h4,
    sortable: true,
    renderCell: ({ h4 }) => {
      if (typeof h4 !== "number") return naLabel;
      return h4.toPrecision(3);
    },
  },
  {
    id: "clpp",
    label: "CLPP",
    filterValue: false,
    comparator: (a, b) => a?.clpp - b?.clpp,
    sortable: true,
    renderCell: ({ clpp }) => {
      if (typeof clpp !== "number") return naLabel;
      return clpp.toPrecision(3);
    },
  },
];

type BodyProps = {
  studyLocusId: string;
  entity: string;
};

function Body({ studyLocusId, entity }: BodyProps) {
  const variables = {
    studyLocusId: studyLocusId,
  };

  const request = useQuery(MOLQTL_COLOC_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      renderDescription={() => <Description />}
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
            rows={request.data?.credibleSet.colocalisation}
            query={MOLQTL_COLOC_QUERY.loc.source.body}
            variables={variables}
          />
        );
      }}
    />
  );
}

export default Body;