import { useQuery } from "@apollo/client";
import {
  Link,
  SectionItem,
  ScientificNotation,
  DisplayVariantId,
  OtTable,
  Tooltip,
  ClinvarStars,
} from "ui";
import { Box, Chip } from "@mui/material";
import { clinvarStarMap, naLabel, sectionsBaseSizeQuery } from "../../constants";
import { definition } from ".";
import Description from "./Description";
import QTL_CREDIBLE_SETS_QUERY from "./QTLCredibleSetsQuery.gql";
import { mantissaExponentComparator, variantComparator } from "../../utils/comparators";
import { ReactNode } from "react";

type getColumnsType = {
  id: string;
  referenceAllele: string;
  alternateAllele: string;
};

function getColumns({ id, referenceAllele, alternateAllele }: getColumnsType) {
  return [
    {
      id: "studyLocusId",
      label: "Navigate",
      renderCell: ({ studyLocusId }) => (
        <Link to={`../credible-set/${studyLocusId}`}>{studyLocusId}</Link>
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
        const displayElement = (
          <DisplayVariantId
            variantId={variantId}
            referenceAllele={referenceAllele}
            alternateAllele={alternateAllele}
            expand={false}
          />
        );
        if (variantId === id) {
          return (
            <Box display="flex" alignItems="center" gap={0.5}>
              {displayElement}
              <Chip label="self" variant="outlined" size="small" />
            </Box>
          );
        }
        return <Link to={`/variant/${variantId}`}>{displayElement}</Link>;
      },
      exportValue: ({ variant }) => variant?.id,
    },
    {
      id: "study.studyId",
      label: "Study",
      renderCell: ({ study }) => {
        if (!study) return naLabel;
        return <Link to={`../study/${study.studyId}`}>{study.studyId}</Link>;
      },
    },
    {
      id: "study.studyType",
      label: "Type",
      renderCell: ({ study }) => {
        const type = study?.studyType;
        if (!type) return naLabel;
        return `${type.slice(0, -3)}${type.slice(-3).toUpperCase()}`;
      },
      exportValue: ({ study }) => {
        const type = study?.studyType;
        if (!type) return null;
        return `${type.slice(0, -3)}${type.slice(-3).toUpperCase()}`;
      },
    },
    {
      id: "study.target.approvedSymbol",
      label: "Affected gene",
      renderCell: ({ study }) => {
        if (!study?.target) return naLabel;
        return <Link to={`/target/${study.target.id}`}>{study.target.approvedSymbol}</Link>;
      },
    },
    {
      id: "study",
      label: "Affected tissue/cell",
      renderCell: ({ study }) => {
        const biosampleId = study?.biosample?.biosampleId;
        if (!biosampleId) return naLabel;
        return (
          <Link external to={`https://www.ebi.ac.uk/ols4/search?q=${biosampleId}&ontology=uberon`}>
            {study?.biosample?.biosampleName}
          </Link>
        );
      },
    },
    {
      id: "study.condition",
      label: "Condition",
      renderCell: ({ study }) => study?.condition || naLabel,
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
      sortable: true,
      renderCell: ({ beta }) => {
        if (typeof beta !== "number") return naLabel;
        return beta.toPrecision(3);
      },
    },
    {
      id: "posteriorProbability",
      label: "Posterior probability",
      filterValue: false,
      tooltip: (
        <>
          Posterior inclusion probability that the fixed page variant (
          <DisplayVariantId
            variantId={id}
            referenceAllele={referenceAllele}
            alternateAllele={alternateAllele}
            expand={false}
          />
          ) is causal.
        </>
      ),
      comparator: (rowA, rowB) =>
        rowA.locus.rows[0].posteriorProbability - rowB.locus.rows[0].posteriorProbability,
      sortable: true,
      renderCell: ({ locus }) => locus.rows[0]?.posteriorProbability.toFixed(3) ?? naLabel,
      exportValue: ({ locus }) => locus.rows[0]?.posteriorProbability.toFixed(3),
    },
    {
      id: "confidence",
      label: "Fine-mapping confidence",
      sortable: true,
      renderCell: ({ confidence }) => {
        if (!confidence) return naLabel;
        return (
          <Tooltip title={confidence} style="">
            <ClinvarStars num={clinvarStarMap[confidence]} />
          </Tooltip>
        );
      },
      filterValue: ({ confidence }) => clinvarStarMap[confidence],
    },
    {
      id: "finemappingMethod",
      label: "Fine-mapping method",
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
}

type BodyProps = {
  id: string;
  entity: string;
};

function Body({ id, entity }: BodyProps): ReactNode {
  const variables = {
    variantId: id,
    size: sectionsBaseSizeQuery,
  };

  const request = useQuery(QTL_CREDIBLE_SETS_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      renderDescription={() => (
        <Description
          variantId={request.data?.variant?.id}
          referenceAllele={request.data?.variant?.referenceAllele}
          alternateAllele={request.data?.variant?.alternateAllele}
        />
      )}
      renderBody={() => {
        return (
          <OtTable
            dataDownloader
            showGlobalFilter
            sortBy="pValue"
            columns={getColumns({
              id,
              referenceAllele: request.data?.variant.referenceAllele,
              alternateAllele: request.data?.variant.alternateAllele,
            })}
            rows={request.data?.variant.qtlCredibleSets.rows}
            loading={request.loading}
            query={QTL_CREDIBLE_SETS_QUERY.loc.source.body}
            variables={variables}
          />
        );
      }}
    />
  );
}

export default Body;
