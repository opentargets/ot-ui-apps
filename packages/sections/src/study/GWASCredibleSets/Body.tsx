import { useQuery } from "@apollo/client";
import {
  Link,
  SectionItem,
  ScientificNotation,
  DisplayVariantId,
  OtTable,
} from "ui";
import { Box } from "@mui/material";
import { naLabel } from "../../constants";
import { definition } from ".";
import Description from "./Description";
import GWAS_CREDIBLE_SETS_QUERY from "./GWASCredibleSetsQuery.gql";
import { mantissaExponentComparator, variantComparator } from "../../utils/comparators";
import ManhattanPlot from "./ManhattanPlot";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const columns = [
  {
    id: "studyLocusId",
    label: "Navigate",
    renderCell: ({ studyLocusId }) => (
      <Box sx={{ display: "flex" }}>
        <Link to={`/credible-set/${studyLocusId}`}>
          <FontAwesomeIcon icon={faArrowRightToBracket} />
        </Link>
      </Box>
    ),
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
    label: "Fine-mapping method",
  },
  {
    id: "TopL2G",
    label: "Top L2G",
    tooltip: "Top gene prioritised by our locus-to-gene model",
    filterValue: ({ l2Gpredictions }) => l2Gpredictions?.[0]?.target.approvedSymbol,
    renderCell: ({ l2Gpredictions }) => {
      const { target } = l2Gpredictions?.[0];
      if (!target) return naLabel;
      return <Link to={`/target/${target.id}`}>{target.approvedSymbol}</Link>;
    },
    exportValue: ({ l2Gpredictions }) => l2Gpredictions?.[0]?.target.approvedSymbol,
  },
  {
    id: "l2gScore",
    label: "L2G score",
    comparator: (rowA, rowB) => rowA?.l2Gpredictions?.[0]?.score - rowB?.l2Gpredictions?.[0]?.score,
    sortable: true,
    filterValue: false,
    renderCell: ({ l2Gpredictions }) => {
      const { score } = l2Gpredictions?.[0];
      if (typeof score !== "number") return naLabel;
      return score.toFixed(3);
    },
    exportValue: ({ l2Gpredictions }) => l2Gpredictions?.[0]?.score,
  },
  {
    id: "credibleSetSize",
    label: "Credible set size",
    comparator: (a, b) => a.locus?.count - b.locus?.count,
    sortable: true,
    filterValue: false,
    renderCell: ({ locus }) => locus?.count ?? naLabel,
    exportValue: ({ locus }) => locus?.count,
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
            data={request.data?.gwasStudy[0].credibleSets.rows}
          />
          <OtTable
            dataDownloader
            showGlobalFilter
            sortBy="pValue"
            loading={request.loading}
            columns={columns}
            rows={request.data?.gwasStudy[0].credibleSets.rows}
            query={GWAS_CREDIBLE_SETS_QUERY.loc.source.body}
            variables={variables}
          />
        </>
      )}
    />
  );
}

export default Body;
