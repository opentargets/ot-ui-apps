import {
  Link,
  SectionItem,
  ScientificNotation,
  DisplayVariantId,
  OtTable,
  Tooltip,
  ClinvarStars,
  L2GScoreIndicator,
  useBatchQuery,
  Navigate,
  Box,
  Chip,
} from "ui";
import { definition } from ".";
import Description from "./Description";
import GWAS_CREDIBLE_SETS_QUERY from "./GWASCredibleSetsQuery.gql";
import { Fragment } from "react/jsx-runtime";
import { mantissaExponentComparator, variantComparator, nullishComparator } from "@ot/utils";
import { credsetConfidenceMap, naLabel, table5HChunkSize } from "@ot/constants";

type getColumnsType = {
  id: string;
  referenceAllele: string;
  alternateAllele: string;
};

function getDiseases({ diseaseIds = [], diseaseNames = [] }) {
  const count = Math.max(diseaseIds.length, diseaseNames.length);

  return Array.from({ length: count }, (_, index) => ({
    id: diseaseIds[index],
    name: diseaseNames[index],
  }));
}

function getColumns({ id, referenceAllele, alternateAllele }: getColumnsType) {
  return [
    {
      id: "studyLocusId",
      label: "Credible set",
      sticky: true,
      enableHiding: false,
      renderCell: ({ studyLocusId }) => <Navigate to={`/credible-set/${studyLocusId}`} />,
    },
    {
      id: "leadVariant",
      label: "Lead variant",
      enableHiding: false,
      comparator: variantComparator(d => ({
        chromosome: d?.leadChromosome?.replace(/^chr/, ""),
        position: d?.leadPosition,
        referenceAllele: d?.leadReferenceAllele,
        alternateAllele: d?.leadAlternateAllele,
      })),
      sortable: true,
      filterValue: ({ leadVariantId }) => leadVariantId,
      renderCell: ({ leadVariantId, leadReferenceAllele, leadAlternateAllele }) => {
        if (!leadVariantId) return naLabel;
        const displayElement = (
          <DisplayVariantId
            variantId={leadVariantId}
            referenceAllele={leadReferenceAllele}
            alternateAllele={leadAlternateAllele}
            expand={false}
          />
        );
        if (leadVariantId === id) {
          return (
            <Box display="flex" alignItems="center" gap={0.5}>
              {displayElement}
              <Chip label="self" />
            </Box>
          );
        }
        return (
          <Link asyncTooltip to={`/variant/${leadVariantId}`}>
            {displayElement}
          </Link>
        );
      },
      exportValue: ({ leadVariantId }) => leadVariantId,
    },
    {
      id: "trait",
      label: "Reported trait",
      filterValue: ({ traitFromSource }) => traitFromSource,
      renderCell: ({ traitFromSource }) => {
        if (!traitFromSource) return naLabel;
        return traitFromSource;
      },
      exportValue: ({ traitFromSource }) => traitFromSource,
    },
    {
      id: "disease",
      label: "Disease/phenotype",
      filterValue: ({ diseaseNames }) => diseaseNames?.join(", "),
      renderCell: (row) => {
        const diseases = getDiseases(row);
        if (!diseases.length) return naLabel;
        return (
          <>
            {diseases.map(({ id: diseaseId, name }, index) => (
              <Fragment key={diseaseId || name}>
                {index > 0 && ", "}
                {diseaseId ? (
                  <Link asyncTooltip to={`../disease/${diseaseId}`}>
                    {name || diseaseId}
                  </Link>
                ) : (
                  name || naLabel
                )}
              </Fragment>
            ))}
          </>
        );
      },
      exportValue: ({ diseaseNames }) => diseaseNames?.join(", "),
    },
    {
      id: "studyId",
      label: "Study",
      renderCell: ({ studyId }) => {
        if (!studyId) return naLabel;
        return (
          <Link asyncTooltip to={`../study/${studyId}`}>
            {studyId}
          </Link>
        );
      },
      exportValue: ({ studyId }) => studyId,
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
      comparator: (a, b) => a?.posteriorProbability - b?.posteriorProbability,
      sortable: true,
      renderCell: ({ posteriorProbability }) =>
        typeof posteriorProbability === "number" ? posteriorProbability.toPrecision(3) : naLabel,
      exportValue: ({ posteriorProbability }) => posteriorProbability,
    },
    {
      id: "finemappingMethod",
      label: "Fine-mapping method",
    },
    {
      id: "confidence",
      label: "Fine-mapping confidence",
      tooltip: (
        <>
          Fine-mapping confidence based on the suitability of the linkage-disequilibrium information
          and fine-mapping method. See{" "}
          <Link
            external
            to="https://platform-docs.opentargets.org/credible-set#credible-set-confidence"
          >
            here
          </Link>{" "}
          for more details.
        </>
      ),
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
      filterValue: ({ topL2GApprovedSymbol }) => topL2GApprovedSymbol,
      tooltip: (
        <>
          Top gene prioritised by our locus-to-gene model. See{" "}
          <Link external to="https://platform-docs.opentargets.org/gentropy/locus-to-gene-l2g">
            our documentation
          </Link>{" "}
          for more information.
        </>
      ),
      renderCell: ({ topL2GGeneId, topL2GApprovedSymbol }) => {
        if (!topL2GGeneId || !topL2GApprovedSymbol) return naLabel;
        return (
          <Link asyncTooltip to={`/target/${topL2GGeneId}`}>
            {topL2GApprovedSymbol}
          </Link>
        );
      },
      exportValue: ({ topL2GApprovedSymbol }) => topL2GApprovedSymbol,
    },
    {
      id: "l2gScore",
      label: "L2G score",
      comparator: nullishComparator(
        (a, b) => a - b,
        row => row?.topL2GScore,
        false
      ),
      sortable: true,
      tooltip: (
        <>
          Machine learning prediction linking a gene to a credible set using all features. Score
          range [0,1]. See{" "}
          <Link external to="https://platform-docs.opentargets.org/gentropy/locus-to-gene-l2g">
            our documentation
          </Link>{" "}
          for more information.
        </>
      ),
      renderCell: ({ studyLocusId, topL2GGeneId, topL2GScore }) => {
        if (!topL2GGeneId || typeof topL2GScore !== "number") return naLabel;
        return (
          <L2GScoreIndicator
            score={topL2GScore}
            studyLocusId={studyLocusId}
            targetId={topL2GGeneId}
          />
        );
      },
      exportValue: ({ topL2GScore }) => topL2GScore,
    },
    {
      id: "credibleSetSize",
      label: "Credible set size",
      comparator: (a, b) => a?.locusSize - b?.locusSize,
      sortable: true,
      numeric: true,
      filterValue: false,
      renderCell: ({ locusSize }) => {
        return typeof locusSize === "number" ? locusSize.toLocaleString() : naLabel;
      },
      exportValue: ({ locusSize }) => locusSize,
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
    size: table5HChunkSize,
    index: 0,
  };

  const request = useBatchQuery({
    id,
    query: GWAS_CREDIBLE_SETS_QUERY,
    variables,
    dataPath: "gwasCredibleSetsByVariant",
    size: table5HChunkSize,
  });

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      showContentLoading
      loadingMessage="Loading data. This may take some time..."
      renderDescription={() => (
        <Description
          variantId={request.data?.variant.variantId}
          referenceAllele={request.data?.variant.referenceAllele}
          alternateAllele={request.data?.variant.alternateAllele}
        />
      )}
      renderBody={() => {
        const columns = getColumns({
          id,
          referenceAllele: request.data?.variant.referenceAllele,
          alternateAllele: request.data?.variant.alternateAllele,
        });
        return (
          <>
            <OtTable
              dataDownloader
              dataDownloaderFileStem={`${id}-gwas-credible-sets-variant`}
              showGlobalFilter
              sortBy="l2gScore"
              order="desc"
              columns={columns}
              rows={request.data?.gwasCredibleSetsByVariant.rows}
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
