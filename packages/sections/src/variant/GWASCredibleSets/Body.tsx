import {
  Link,
  SectionItem,
  ScientificNotation,
  DisplayVariantId,
  OtTable,
  Tooltip,
  ClinvarStars,
  OtScoreLinearBar,
  useBatchQuery,
  Navigate,
} from "ui";
import { Box, Chip } from "@mui/material";
import { credsetConfidenceMap, initialResponse, naLabel, table5HChunkSize } from "../../constants";
import { definition } from ".";
import Description from "./Description";
import GWAS_CREDIBLE_SETS_QUERY from "./GWASCredibleSetsQuery.gql";
import { Fragment } from "react/jsx-runtime";
import { mantissaExponentComparator, variantComparator } from "../../utils/comparators";
import PheWasPlot from "./PheWasPlot";
import { useEffect, useState } from "react";
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
      id: "trait",
      label: "Reported trait",
      filterValue: ({ study }) => study?.traitFromSource,
      renderCell: ({ study }) => {
        if (!study?.traitFromSource) return naLabel;
        return study.traitFromSource;
      },
      exportValue: ({ study }) => study?.traitFromSource,
    },
    {
      id: "disease",
      label: "Disease/phenotype",
      filterValue: ({ study }) => study?.diseases.map(d => d.name).join(", "),
      renderCell: ({ study }) => {
        if (!study?.diseases?.length) return naLabel;
        return (
          <>
            {study.diseases.map((d, i) => (
              <Fragment key={d.id}>
                {i > 0 && ", "}
                <Link to={`../disease/${d.id}`}>{d.name}</Link>
              </Fragment>
            ))}
          </>
        );
      },
      exportValue: ({ study }) => study?.diseases?.map(d => d.name).join(", "),
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
      renderCell: ({ beta }) => {
        if (typeof beta !== "number") return naLabel;
        return beta.toFixed(3);
      },
    },
    {
      id: "posteriorProbability",
      label: "Posterior probability",
      numeric: true,
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
      renderCell: ({ locus }) =>
        locus.count > 0 ? locus?.rows[0]?.posteriorProbability.toFixed(3) : naLabel,
      exportValue: ({ locus }) =>
        locus.count > 0 ? locus?.rows[0]?.posteriorProbability.toFixed(3) : naLabel,
    },
    {
      id: "finemappingMethod",
      label: "Fine-mapping method",
    },
    {
      id: "confidence",
      label: "Fine-mapping confidence",
      tooltip:
        "Fine-mapping confidence based on the suitability of the linkage-desequilibrium information and fine-mapping method",
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
      filterValue: ({ l2GPredictions }) => l2GPredictions?.rows[0]?.target?.approvedSymbol,
      tooltip: "Top gene prioritised by our locus-to-gene model",
      renderCell: ({ l2GPredictions }) => {
        if (!l2GPredictions?.rows[0]?.target) return naLabel;
        const { target } = l2GPredictions?.rows[0];
        return <Link to={`/target/${target.id}`}>{target.approvedSymbol}</Link>;
      },
      exportValue: ({ l2GPredictions }) => l2GPredictions?.target.approvedSymbol,
    },
    {
      id: "l2gScore",
      label: "L2G score",
      comparator: (rowA, rowB) =>
        rowA?.l2GPredictions?.rows[0]?.score - rowB?.l2GPredictions?.rows[0]?.score,
      sortable: true,
      tooltip:
        "Machine learning prediction linking a gene to a credible set using all features. Score range [0,1].",
      renderCell: ({ l2GPredictions }) => {
        if (!l2GPredictions?.rows[0]?.score) return naLabel;
        return (
          <Tooltip title={l2GPredictions?.rows[0].score.toFixed(3)} style="">
            <OtScoreLinearBar variant="determinate" value={l2GPredictions?.rows[0].score * 100} />
          </Tooltip>
        );
      },
    },
    {
      id: "credibleSetSize",
      label: "Credible set size",
      comparator: (a, b) => a.locus?.count - b.locus?.count,
      sortable: true,
      numeric: true,
      filterValue: false,
      renderCell: ({ locus }) => {
        return typeof locus?.count === "number"
          ? locus.count.toLocaleString()
          : naLabel;
      },
      exportValue: ({ locus }) => locus?.count,
    },
  ];
}

type BodyProps = {
  id: string;
  entity: string;
};

function Body({ id, entity }: BodyProps) {
  const variables = {
    variantId: id,
  };

  const [request, setRequest] = useState<responseType>(initialResponse);

  const getAllGwasData = useBatchQuery({
    query: GWAS_CREDIBLE_SETS_QUERY,
    variables: {
      variantId: id,
      size: table5HChunkSize,
      index: 0,
    },
    dataPath: "data.variant.gwasCredibleSets",
    size: table5HChunkSize,
  });

  useEffect(() => {
    getAllGwasData().then(r => {
      setRequest(r);
    });
  }, []);

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      showContentLoading
      loadingMessage="Loading data. This may take some time..."
      renderDescription={() => (
        <Description
          variantId={request.data?.variant.id}
          referenceAllele={request.data?.variant.referenceAllele}
          alternateAllele={request.data?.variant.alternateAllele}
        />
      )}
      renderChart={() => {
        return (
          <PheWasPlot
            loading={request.loading}
            data={request.data?.variant.gwasCredibleSets.rows}
            id={id}
          />
        );
      }}
      renderBody={() => {
        return (
          <>
            <OtTable
              dataDownloader
              showGlobalFilter
              sortBy="l2gScore"
              order="desc"
              columns={getColumns({
                id,
                referenceAllele: request.data?.variant.referenceAllele,
                alternateAllele: request.data?.variant.alternateAllele,
              })}
              rows={request.data?.variant.gwasCredibleSets.rows}
              loading={request.loading}
              query={GWAS_CREDIBLE_SETS_QUERY.loc.source.body}
              variables={variables}
            />
          </>
        );
      }}
    />
  );
}

export default Body;
