import { useQuery } from "@apollo/client";
import { Box, Chip, Typography } from "@mui/material";
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

function isNumber(value: any): boolean {
  return typeof value === "number" && isFinite(value);
}

const columns = [
  {
    id: "target.approvedSymbol",
    label: "Gene",
    sortable: true,
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
      if (target?.biotype === "protein_coding") {
        displayElement = (
          <>
            {displayElement}{" "}
            <Chip
              variant="outlined"
              size="small"
              sx={{ typography: "caption" }}
              label="protein coding"
            />{" "}
          </>
        );
      }
      return displayElement;
    },
  },
  {
    id: "variantConsequences.label",
    label: "Predicted consequence",
    renderCell: ({ variantConsequences, aminoAcidChange, codons, uniprotAccessions }) => {
      if (!variantConsequences?.length) return naLabel;
      let displayElement = variantConsequences.map(({ id, label }, i, arr) => (
        <Fragment key={id}>
          <Link external to={identifiersOrgLink("SO", id.slice(3))}>
            {formatVariantConsequenceLabel(label)}
          </Link>
          {i < arr.length - 1 && ", "}
        </Fragment>
      ));
      if (aminoAcidChange)
        displayElement = (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {displayElement}&nbsp;{" "}
            <Chip
              variant="outlined"
              size="small"
              sx={{ typography: "caption" }}
              label={aminoAcidChange}
            />
          </Box>
        );
      if (aminoAcidChange && uniprotAccessions?.length) {
        const tooltipContent = (
          <>
            {codons && (
              <>
                <b>Trancript consequence:</b>
                <br />
                {codons}
                <br />
              </>
            )}
            <b>Protein:</b>
            <br />
            {/* Uniprot accession:&nbsp; */}
            {uniprotAccessions.map((id, i, arr) => (
              <Fragment key={id}>
                <Link external to={`https://identifiers.org/uniprot:${id}`} footer={false}>
                  {id}
                </Link>
                {i < arr.length - 1 && ", "}
              </Fragment>
            ))}
          </>
        );

        displayElement = (
          <Tooltip title={tooltipContent} style="">
            {displayElement}
          </Tooltip>
        );
      }
      return displayElement;
    },
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
    id: "distanceFromFootprint",
    label: "Distance from footprint",
    numeric: true,
    sortable: true,
    renderCell: ({ distanceFromFootprint }) =>
      isNumber(distanceFromFootprint)
        ? parseInt(distanceFromFootprint, 10).toLocaleString()
        : naLabel,
  },
  {
    id: "distanceFromTss",
    label: "Distance from start site",
    numeric: true,
    sortable: true,
    renderCell: ({ distanceFromTss }) =>
      isNumber(distanceFromTss) ? parseInt(distanceFromTss, 10).toLocaleString() : naLabel,
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
        const sortedRows = [...request.data?.variant.transcriptConsequences];
        sortedRows.sort((a, b) => a.transcriptIndex - b.transcriptIndex);
        return (
          <OtTable
            columns={columns}
            rows={sortedRows}
            dataDownloader
            query={VARIANT_EFFECT_PREDICTOR_QUERY.loc.source.body}
            variables={variables}
            loading={request.loading}
          />
        );
      }}
    />
  );
}

export default Body;
