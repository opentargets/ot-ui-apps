import { useQuery } from "@apollo/client";
import { Box, Chip } from "@mui/material";
import { Link, SectionItem, ScientificNotation, DisplayVariantId, OtTable } from "ui";
import { naLabel } from "../../constants";
import { definition } from ".";
import Description from "./Description";
import VARIANTS_QUERY from "./VariantsQuery.gql";
import { mantissaExponentComparator, variantComparator } from "../../utils/comparators";

type getColumnsType = {
  leadVariantId: string;
  leadReferenceAllele: string;
  leadAlternateAllele: string;
};

function getColumns({ leadVariantId, leadReferenceAllele, leadAlternateAllele }: getColumnsType) {
  return [
    {
      id: "variant.id",
      label: "Variant ID",
      comparator: variantComparator,
      sortable: true,
      filterValue: ({ variant: v }) =>
        `${v?.chromosome}_${v?.position}_${v?.referenceAllele}_${v?.alternateAllele}`,
      renderCell: ({ variant }) => {
        if (!variant) return naLabel;
        const { id: variantId, referenceAllele, alternateAllele } = variant;
        const displayElement = (
          <Link to={`/variant/${variantId}`}>
            <DisplayVariantId
              variantId={variantId}
              referenceAllele={referenceAllele}
              alternateAllele={alternateAllele}
              expand={false}
            />
          </Link>
        );
        if (variantId === leadVariantId) {
          return (
            <Box display="flex" alignItems="center" gap={0.5}>
              {displayElement}
              <Chip label="lead" variant="outlined" size="small" />
            </Box>
          );
        }
        return displayElement;
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
        if (typeof pValueMantissa !== "number" || typeof pValueExponent !== "number")
          return naLabel;
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
      id: "standardError",
      label: "Standard error",
      filterValue: false,
      tooltip:
        "Standard Error: Estimate of the standard deviation of the sampling distribution of the beta",
      renderCell: ({ standardError }) => {
        if (typeof standardError !== "number") return naLabel;
        return standardError.toPrecision(3);
      },
    },
    {
      id: "r2Overall",
      label: "LD (r²)",
      filterValue: false,
      tooltip: (
        <>
          Linkage disequilibrium with the lead variant (
          <DisplayVariantId
            variantId={leadVariantId}
            referenceAllele={leadReferenceAllele}
            alternateAllele={leadAlternateAllele}
            expand={false}
          />
          )
        </>
      ),
      renderCell: ({ r2Overall }) => {
        if (typeof r2Overall !== "number") return naLabel;
        return r2Overall.toPrecision(3);
      },
    },
    {
      id: "posteriorProbability",
      label: "Posterior Probability",
      filterValue: false,
      tooltip: "Posterior inclusion probability from fine-mapping that this variant is causal",
      comparator: (rowA, rowB) => rowA?.posteriorProbability - rowB?.posteriorProbability,
      sortable: true,
      renderCell: ({ posteriorProbability }) => {
        if (typeof posteriorProbability !== "number") return naLabel;
        return posteriorProbability.toPrecision(3);
      },
    },
    {
      id: "logBF",
      label: "LOG(BF)",
      filterValue: false,
      renderCell: ({ logBF }) => {
        if (typeof logBF !== "number") return naLabel;
        return logBF.toPrecision(3);
      },
    },
  ];
}

type BodyProps = {
  studyLocusId: string;
  leadVariantId: string;
  leadReferenceAllele: string;
  leadAlternateAllele: string;
  entity: string;
};

function Body({
  studyLocusId,
  leadVariantId,
  leadReferenceAllele,
  leadAlternateAllele,
  entity,
}: BodyProps) {
  const variables = {
    studyLocusIds: [studyLocusId],
  };

  const request = useQuery(VARIANTS_QUERY, {
    variables,
  });

  const columns = getColumns({
    leadVariantId,
    leadReferenceAllele,
    leadAlternateAllele,
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
            showGlobalFilter
            dataDownloader
            dataDownloaderFileStem={`${studyLocusId}-credibleset`}
            sortBy="posteriorProbability"
            order="desc"
            columns={columns}
            loading={request.loading}
            rows={request.data?.credibleSets[0].locus}
            query={VARIANTS_QUERY.loc.source.body}
            variables={variables}
          />
        );
      }}
    />
  );
}

export default Body;
