import {
  Link,
  SectionItem,
  ScientificNotation,
  DisplayVariantId,
  OtTable,
  Tooltip,
  ClinvarStars,
  useBatchQuery,
  Navigate,
} from "ui";
import { Box, Chip } from "@mui/material";
import { credsetConfidenceMap, initialResponse, naLabel, table5HChunkSize } from "../../constants";
import { definition } from ".";
import Description from "./Description";
import QTL_CREDIBLE_SETS_QUERY from "./QTLCredibleSetsQuery.gql";
import { mantissaExponentComparator, variantComparator } from "../../utils/comparators";
import { ReactNode, useEffect, useState } from "react";
import { responseType } from "ui/src/types/response";

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
      renderCell: ({ studyLocusId }) => <Navigate to={`/credible-set/${studyLocusId}`} />,
    },
    {
      id: "leadVariant",
      label: "Lead variant",
      comparator: variantComparator(d => d.variant),
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
      id: "studyId",
      label: "Study",
      renderCell: ({ study }) => {
        if (!study) return naLabel;
        return <Link to={`../study/${study.id}`}>{study.id}</Link>;
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
      exportValue: ({ study }) => {
        return `[${study?.biosample?.biosampleId}]:${study?.biosample?.biosampleName}`;
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
        if (typeof pValueMantissa !== "number" || typeof pValueExponent !== "number")
          return naLabel;
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
      numeric: true,
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
      numeric: true,
      filterValue: false,
      sortable: true,
      comparator: (a, b) => {
        return (
          a?.locus?.rows?.[0]?.posteriorProbability - b?.locus?.rows?.[0]?.posteriorProbability
        );
      },
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
      renderCell: ({ locus }) =>
        locus.rows.length > 0 ? locus?.rows[0]?.posteriorProbability.toPrecision(3) : naLabel,
      exportValue: ({ locus }) =>
        locus.rows.length > 0 ? locus?.rows[0]?.posteriorProbability : naLabel,
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
      id: "finemappingMethod",
      label: "Fine-mapping method",
    },
    {
      id: "credibleSetSize",
      label: "Credible set size",
      numeric: true,
      comparator: (a, b) => a.locusSize?.count - b.locusSize?.count,
      sortable: true,
      filterValue: false,
      renderCell: ({ locusSize }) => {
        return typeof locusSize?.count === "number" ? locusSize.count.toLocaleString() : naLabel;
      },
      exportValue: ({ locusSize }) => locusSize?.count,
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
    size: table5HChunkSize,
    index: 0,
  };

  const [request, setRequest] = useState<responseType>(initialResponse);

  const getAllQtlData = useBatchQuery({
    query: QTL_CREDIBLE_SETS_QUERY,
    variables,
    dataPath: "data.variant.qtlCredibleSets",
    size: table5HChunkSize,
  });

  useEffect(() => {
    getAllQtlData().then(r => {
      setRequest(r);
    });
  }, [id]);

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      showContentLoading
      loadingMessage="Loading data. This may take some time..."
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
