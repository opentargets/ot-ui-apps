import { useQuery } from "@apollo/client";
import { Link, SectionItem, DisplayVariantId, ScientificNotation, OtTable } from "ui";
import { naLabel } from "../../constants";
import { definition } from ".";
import Description from "./Description";
import GWAS_COLOC_QUERY from "./GWASColocQuery.gql";
import { mantissaExponentComparator, variantComparator } from "../../utils/comparators";
import { getStudyCategory } from "../../utils/getStudyCategory";

const columns = [
  {
    id: "view",
    label: "Details",
    renderCell: ({ otherStudyLocus }) => {
      if (!otherStudyLocus) return naLabel;
      return <Link to={`./${otherStudyLocus.studyLocusId}`}>view</Link>;
    },
    filterValue: false,
    exportValue: false,
  },
  {
    id: "otherStudyLocus.study.studyId",
    label: "Study ID",
    renderCell: ({ otherStudyLocus }) => {
      const studyId = otherStudyLocus?.study?.studyId;
      if (!studyId) return naLabel;
      return <Link to={`../study/${studyId}`}>{studyId}</Link>;
    },
  },
  {
    id: "otherStudyLocus.study.traitFromSource",
    label: "Trait",
    renderCell: ({ otherStudyLocus }) => {
      const trait = otherStudyLocus?.study?.traitFromSource;
      if (!trait) return naLabel;
      return trait;
    },
  },
  {
    id: "otherStudyLocus.study.publicationFirstAuthor",
    label: "Author",
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
    studyLocusIds: [studyLocusId],
  };

  const request = useQuery(GWAS_COLOC_QUERY, {
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
            rows={request.data?.credibleSets[0].colocalisation}
            query={GWAS_COLOC_QUERY.loc.source.body}
            variables={variables}
          />
        );
      }}
    />
  );
}

export default Body;
