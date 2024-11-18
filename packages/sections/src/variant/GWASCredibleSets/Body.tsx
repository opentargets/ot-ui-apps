import { useQuery } from "@apollo/client";
import {
  Link,
  SectionItem,
  ScientificNotation,
  DisplayVariantId,
  OtTable,
  Tooltip,
  ClinvarStars,
  OtScoreLinearBar,
} from "ui";
import { Box, Chip } from "@mui/material";
import { clinvarStarMap, naLabel } from "../../constants";
import { definition } from ".";
import Description from "./Description";
import GWAS_CREDIBLE_SETS_QUERY from "./GWASCredibleSetsQuery.gql";
import { Fragment } from "react/jsx-runtime";
import { mantissaExponentComparator, variantComparator } from "../../utils/comparators";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type getColumnsType = {
  id: string;
  referenceAllele: string;
  alternateAllele: string;
  posteriorProbabilities: any;
};

function getColumns({
  id,
  referenceAllele,
  alternateAllele,
  posteriorProbabilities,
}: getColumnsType) {
  return [
    {
      id: "studyLocusId",
      label: "Navigate",
      renderCell: ({ studyLocusId }) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
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
      label: "Trait",
      filterValue: ({ study }) => study?.traitFromSource,
      renderCell: ({ study }) => {
        if (!study?.traitFromSource) return naLabel;
        return study.traitFromSource;
      },
      exportValue: ({ study }) => study?.traitFromSource,
    },
    {
      id: "disease",
      label: "Diseases",
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
      id: "study.studyId",
      label: "Study ID",
      renderCell: ({ study }) => {
        if (!study) return naLabel;
        return <Link to={`../study/${study.studyId}`}>{study.studyId}</Link>;
      },
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
        posteriorProbabilities.get(rowA.locus) - posteriorProbabilities.get(rowB.locus),
      sortable: true,
      renderCell: ({ locus }) => posteriorProbabilities.get(locus)?.toFixed(3) ?? naLabel,
      exportValue: ({ locus }) => posteriorProbabilities.get(locus)?.toFixed(3),
    },
    {
      id: "confidence",
      label: "Confidence",
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
      label: "Finemapping method",
    },
    {
      id: "topL2G",
      label: "Top L2G",
      filterValue: ({ l2Gpredictions }) => l2Gpredictions?.target.approvedSymbol,
      tooltip: "Top gene prioritised by our locus-to-gene model",
      renderCell: ({ l2Gpredictions }) => {
        if (!l2Gpredictions[0]?.target) return naLabel;
        const { target } = l2Gpredictions[0];
        return <Link to={`/target/${target.id}`}>{target.approvedSymbol}</Link>;
      },
      exportValue: ({ l2Gpredictions }) => l2Gpredictions?.target.approvedSymbol,
    },
    {
      id: "l2gScore",
      label: "L2G score",
      comparator: (rowA, rowB) => rowA?.l2Gpredictions[0]?.score - rowB?.l2Gpredictions[0]?.score,
      sortable: true,
      renderCell: ({ l2Gpredictions }) => {
        if (!l2Gpredictions[0]?.score) return naLabel;
        return (
          <Tooltip title={l2Gpredictions[0].score.toFixed(3)} style="">
            <OtScoreLinearBar variant="determinate" value={l2Gpredictions[0].score * 100} />
          </Tooltip>
        );
      },
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
}

type BodyProps = {
  id: string;
  entity: string;
};

function Body({ id, entity }: BodyProps) {
  const variables = {
    variantId: id,
  };

  const request = useQuery(GWAS_CREDIBLE_SETS_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      renderDescription={() => (
        <Description
          variantId={request.data?.variant.id}
          referenceAllele={request.data?.variant.referenceAllele}
          alternateAllele={request.data?.variant.alternateAllele}
        />
      )}
      renderBody={() => {
        // get columns here so get posterior probabilities once - avoids
        // having to find posterior probs inside sorting comparator function
        const posteriorProbabilities = new Map();
        for (const { locus } of request.data?.variant?.credibleSets || []) {
          const postProb = locus?.find(loc => loc.variant?.id === id)?.posteriorProbability;
          if (postProb !== undefined) {
            posteriorProbabilities.set(locus, postProb);
          }
        }

        return (
          <OtTable
            dataDownloader
            showGlobalFilter
            sortBy="l2gScore"
            order="desc"
            columns={getColumns({
              id,
              referenceAllele: request.data?.variant.referenceAllele,
              alternateAllele: request.data?.variant.alternateAllele,
              posteriorProbabilities,
            })}
            rows={request.data?.variant.credibleSets}
            loading={request.loading}
            query={GWAS_CREDIBLE_SETS_QUERY.loc.source.body}
            variables={variables}
          />
        );
      }}
    />
  );
}

export default Body;
