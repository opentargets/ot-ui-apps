import { useQuery } from "@apollo/client";
import { Link, SectionItem, ScientificNotation, DisplayVariantId, OtTable } from "ui";
import { naLabel } from "../../constants";
import { definition } from ".";
import Description from "./Description";
import GWAS_CREDIBLE_SETS_QUERY from "./GWASCredibleSetsQuery.gql";
import { mantissaExponentComparator, variantComparator } from "../../utils/comparators";

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
  {
    id: "topL2G",
    label: "Top L2G",
    tooltip: "Top gene prioritised by our locus-to-gene model",
    filterValue: ({ strongestLocus2gene }) => strongestLocus2gene?.target.approvedSymbol,
    renderCell: ({ strongestLocus2gene }) => {
      if (!strongestLocus2gene?.target) return naLabel;
      const { target } = strongestLocus2gene;
      return <Link to={`/target/${target.id}`}>{target.approvedSymbol}</Link>;
    },
    exportValue: ({ strongestLocus2gene }) => strongestLocus2gene?.target.approvedSymbol,
  },
  {
    id: "l2gScore",
    label: "L2G score",
    comparator: (rowA, rowB) => rowA?.strongestLocus2gene?.score - rowB?.strongestLocus2gene?.score,
    sortable: true,
    filterValue: false,
    renderCell: ({ strongestLocus2gene }) => {
      if (typeof strongestLocus2gene?.score !== "number") return naLabel;
      return strongestLocus2gene.score.toFixed(3);
    },
    exportValue: ({ strongestLocus2gene }) => strongestLocus2gene?.score,
  },
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
      )}
    />
  );
}

export default Body;
