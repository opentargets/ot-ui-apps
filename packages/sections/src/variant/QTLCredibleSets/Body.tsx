import { useQuery } from "@apollo/client";
import {
  Link,
  SectionItem,
  DataTable,
  ScientificNotation,
  DisplayVariantId
} from "ui";
import { Box, Chip } from "@mui/material";
import { naLabel, defaultRowsPerPageOptions } from "../../constants";
import { definition } from ".";
import Description from "./Description";
import QTL_CREDIBLE_SETS_QUERY from "./QTLCredibleSetsQuery.gql";

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
      posteriorProbabilities
    }: getColumnsType) {

  return [
    {
      id: "leadVariant",
      label: "Lead Variant",
      renderCell: ({ variant }) => {
        if (!variant) return naLabel;
        const { id: variantId, referenceAllele, alternateAllele } = variant;
        const displayElement = <DisplayVariantId
          variantId={variantId}
          referenceAllele={referenceAllele}
          alternateAllele={alternateAllele}
          expand={false}
        />
        if (variantId === id) {
          return <Box display="flex" alignItems="center" gap={0.5}>
            {displayElement}
            <Chip label="self" variant="outlined" size="small"/>
          </Box>;
        }
        return <Link to={`/variant/${variantId}`}>
          {displayElement}
        </Link>;
      },
      exportValue: ({ variant }) => variant?.id,
    },
    {
      id: "study.studyid",
      label: "Study",
      renderCell: ({ study }) => {
        if (!study) return naLabel;
        return <Link to={`../study/${study.studyId}`}>{study.studyId}</Link>
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
      label: "Affected Gene",
      renderCell: ({ study }) => {
        if (!study?.target) return naLabel;
        return <Link to={`/target/${study.target.id}`}>
          {study.target.approvedSymbol}
        </Link>
      },
    },
    {
      id: "study.biosampleFromSourceId",
      label: "Affected Tissue/Cell",
      renderCell: ({ study }) => {
        if (!study?.biosampleFromSourceId) return naLabel;
        return <Link external to={`https://www.ebi.ac.uk/ols4/search?q=${study.biosampleFromSourceId}&ontology=uberon`}>
          {study.biosampleFromSourceId}
        </Link>
      },
    },
    {
      id: "study.condition",
      label: "Condition",
      renderCell: () => <i>Not in API</i>
    },
    {
      id: "pValue",
      label: "P-Value",
      comparator: (a, b) =>
        a?.pValueMantissa * 10 ** a?.pValueExponent -
          b?.pValueMantissa * 10 ** b?.pValueExponent,
      sortable: true,
      renderCell: ({ pValueMantissa, pValueExponent }) => {
        if (typeof pValueMantissa !== "number" ||
            typeof pValueExponent !== "number") return naLabel;
        return <ScientificNotation number={[pValueMantissa, pValueExponent]} />;
      },
      exportValue: ({ pValueMantissa, pValueExponent }) => {
        if (typeof pValueMantissa !== "number" ||
            typeof pValueExponent !== "number") return null;
        return `${pValueMantissa}x10${pValueExponent}`;
      },
    },
    {
      id: "beta",
      label: "Beta",
      tooltip: "Beta with respect to the ALT allele",
      renderCell: ({ beta }) => {
        if (typeof beta !== "number") return naLabel;
        return beta.toPrecision(3);
      },
    },
    {
      id: "posteriorProbability",
      label: "Posterior Probability",
      tooltip: <>
        Probability the fixed page variant (
        <DisplayVariantId
          variantId={id}
          referenceAllele={referenceAllele}
          alternateAllele={alternateAllele}
          expand={false}
        />
        ) is in the credible set.
      </>,
      comparator: (rowA, rowB) => (
        posteriorProbabilities.get(rowA.locus) -
          posteriorProbabilities.get(rowB.locus)
      ),
      sortable: true,
      renderCell: ({ locus }) => posteriorProbabilities.get(locus)?.toFixed(3) ?? naLabel,
      exportValue: ({ locus }) => posteriorProbabilities.get(locus)?.toFixed(3),
    },
    {
      id: "finemappingMethod",
      label: "Finemapping Method",
    },
    {
      id: "credibleSetSize",
      label: "Credible Set Size",
      comparator: (a, b) => a.locus?.length - b.locus?.length,
      sortable: true,
      renderCell: ({ locus }) => locus?.length ?? naLabel,
      exportValue: ({ locus }) => locus?.length,
    }
  ];
}


type BodyProps = {
  id: string,
  entity: string,
};

function Body({ id, entity }: BodyProps) {
  const variables = {
    variantId: id,
  };

  const request = useQuery(QTL_CREDIBLE_SETS_QUERY, {
    variables,
  });
  
  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      renderDescription={({ variant }) => (
        <Description
          variantId={variant.id}
          referenceAllele={variant.referenceAllele}
          alternateAllele={variant.alternateAllele}
        />
      )}
      renderBody={({ variant }) => {

        // get columns here so get posterior probabilities once - avoids
        // having to find posterior probs inside sorting comparator function
        const posteriorProbabilities = new Map;
        for (const { locus } of variant?.credibleSets || []) {
          const postProb = locus
            ?.find(loc => loc.variant?.id === id)
            ?.posteriorProbability
          if (postProb !== undefined) {
            posteriorProbabilities.set(locus, postProb);
          }
        }

        return (
          <DataTable
            dataDownloader
            sortBy="pValue"
            columns={getColumns({
              id,
              referenceAllele: variant.referenceAllele,
              alternateAllele: variant.alternateAllele,
              posteriorProbabilities,
            })}
            rows={variant.credibleSets}
            rowsPerPageOptions={defaultRowsPerPageOptions}
            query={QTL_CREDIBLE_SETS_QUERY.loc.source.body}
            variables={variables}
          />
        );
      }}
    />
  );

}

export default Body;