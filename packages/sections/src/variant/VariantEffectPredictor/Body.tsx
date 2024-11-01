import { useQuery } from "@apollo/client";
import { Box } from "@mui/material";
import { Link, SectionItem, Tooltip, OtTable } from "ui";
import { Fragment } from "react";
import { definition } from "../VariantEffectPredictor";
import Description from "../VariantEffectPredictor/Description";
import { naLabel } from "../../constants";
import { identifiersOrgLink } from "../../utils/global";
import VARIANT_EFFECT_PREDICTOR_QUERY from "./VariantEffectPredictorQuery.gql";

function formatVariantConsequenceLabel(label) {
  return label.replace(/_/g, " ");
}

const columns = [
  {
    id: "target.approvedSymbol",
    label: "Gene",
    comparator: (a, b) => a.transcriptIndex - b.transcriptIndex,
    renderCell: ({ target, transcriptId }) => {
      if (!target) return naLabel;
      let displayElement = <Link to={`../target/${target.id}`}>{target.approvedSymbol}</Link>;
      if (transcriptId) {
        displayElement = (
          <Tooltip
            title={
              <Box>
                Ensembl canonical transcript:{" "}
                <Link
                  external
                  to={`https://www.ensembl.org/Homo_sapiens/Transcript/Summary?db=core;g=${target.id};t=${transcriptId}`}
                >
                  {transcriptId}
                </Link>
              </Box>
            }
            showHelpIcon
          >
            {displayElement}
          </Tooltip>
        );
      }
      return displayElement;
    },
  },
  {
    id: "variantConsequences.label",
    label: "Predicted consequence",
    renderCell: ({ variantConsequences }) =>
      variantConsequences.length
        ? variantConsequences.map(({ id, label }, i, arr) => (
            <Fragment key={id}>
              <Link external to={identifiersOrgLink("SO", id.slice(3))}>
                {formatVariantConsequenceLabel(label)}
              </Link>
              {i < arr.length - 1 && ", "}
            </Fragment>
          ))
        : naLabel,
    exportValue: ({ variantConsequences }) => {
      return variantConsequences
        .map(({ label }) => {
          return formatVariantConsequenceLabel(label);
        })
        .join(", ");
    },
  },
  {
    id: "impact",
    label: "Impact",
    renderCell: ({ impact }) => impact?.toLowerCase?.() ?? naLabel,
  },
  {
    id: "aminoAcidChange",
    label: "Amino acid change",
    renderCell: ({ aminoAcidChange }) => aminoAcidChange ?? naLabel,
  },
  {
    id: "codons",
    label: "Coding change",
    renderCell: ({ codons }) => codons ?? naLabel,
  },
  {
    id: "distanceFromFootprint",
    label: "Distance from footprint",
  },
  {
    id: "distanceFromTss",
    label: "Distance from start site",
  },
  {
    id: "uniprotAccession",
    label: "Uniprot accession",
    renderCell: ({ uniprotAccessions }) =>
      uniprotAccessions?.length
        ? uniprotAccessions.map((id, i, arr) => (
            <Fragment key={id}>
              <Link external to={`https://identifiers.org/uniprot:${id}`}>
                {id}
              </Link>
              {i < arr.length - 1 && ", "}
            </Fragment>
          ))
        : naLabel,
    exportValue: ({ uniprotAccessions }) => (uniprotAccessions ?? []).join(", "),
  },
];

type BodyProps = {
  id: string;
  entity: string;
};

export function Body({ id, entity }: BodyProps) {
  const variables = {
    variantId: id,
  };

  const request = useQuery(VARIANT_EFFECT_PREDICTOR_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      request={request}
      entity={entity}
      renderDescription={() => (
        <Description
          variantId={request.data?.variant.id}
          referenceAllele={request.data?.variant.referenceAllele}
          alternateAllele={request.data?.variant.alternateAllele}
        />
      )}
      renderBody={() => {
        return (
          <OtTable
            columns={columns}
            rows={request.data?.variant.transcriptConsequences}
            dataDownloader
            query={VARIANT_EFFECT_PREDICTOR_QUERY.loc.source.body}
            variables={variables}
            sortBy="target.approvedSymbol"
            loading={request.loading}
          />
        );
      }}
    />
  );
}

export default Body;
