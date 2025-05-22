import { ReactElement } from "react";
import { useQuery } from "@apollo/client";
import { Typography, Grid, Box } from "@mui/material";
import { SectionItem, Tooltip, OtTable, DataDownloader } from "ui";
import { definition } from ".";
import Description from "./Description";
import { naLabel, VIEW } from "@ot/constants";
import VARIANT_EFFECT_QUERY from "./VariantEffectQuery.gql";
import VariantEffectPlot from "./VariantEffectPlot";
import Viewer from "./Viewer";
import { grey } from "@mui/material/colors";

const columns = [
  {
    id: "method",
    label: "Method",
    enableHiding: false,
  },
  {
    id: "assessment",
    label: "Prediction",
    renderCell: ({ assessment, assessmentFlag }) =>
      assessmentFlag ? (
        <Tooltip
          title={
            <>
              <Typography variant="subtitle2" display="block" align="center">
                Flag: {assessmentFlag}
              </Typography>
            </>
          }
          showHelpIcon
        >
          {assessment ?? naLabel}
        </Tooltip>
      ) : (
        assessment ?? naLabel
      ),
  },
  {
    id: "score",
    label: "Score",
    numeric: true,
    renderCell: ({ score }) => score?.toPrecision(3) ?? naLabel,
  },
  {
    id: "normalisedScore",
    label: "Normalised score",
    numeric: true,
    renderCell: ({ normalisedScore }) => normalisedScore?.toFixed(3) ?? naLabel,
  },
];

type BodyProps = {
  id: string;
  entity: string;
};

function getSortedRows(request) {
  return request.data?.variant?.variantEffect
    ? [...request.data.variant.variantEffect]
        .filter(e => e.method !== null)
        .sort((row1, row2) => row1.method.localeCompare(row2.method))
    : [];
}

export function Body({ id, entity }: BodyProps): ReactElement {
  const variables = {
    variantId: id,
  };
  const request = useQuery(VARIANT_EFFECT_QUERY, {
    variables,
  });

  const rows = getSortedRows(request);
  const proteinCodingCoordinatesRow = request.data?.variant?.proteinCodingCoordinates?.rows?.[0];

  return (
    <SectionItem
      definition={definition}
      request={request}
      entity={entity}
      defaultView={VIEW.chart}
      renderDescription={() => (
        <Description
          variantId={request.data?.variant.id}
          referenceAllele={request.data?.variant.referenceAllele}
          alternateAllele={request.data?.variant.alternateAllele}
        />
      )}
      // !! SHOULD CONDITIONALLY RENDER THE VIEWER ONLY IF ROW IS TRUTHY ?? !!
      // - AND RENDER CHART AT FULL WIDTH IF IS NOT
      renderChart={() => {
        return (
          <>
            <Box
              sx={{
                borderColor: grey[300],
                borderRadius: 1,
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
              }}
            >
              <DataDownloader
                btnLabel="Export"
                rows={rows}
                query={VARIANT_EFFECT_QUERY.loc.source.body}
                variables={variables}
                columns={columns}
              />
            </Box>
            <Grid container columnSpacing={2}>
              <Grid item xs={12} lg={12} xl={6}>
                <VariantEffectPlot
                  data={rows}
                  query={VARIANT_EFFECT_QUERY.loc.source.body}
                  variables={variables}
                  columns={columns}
                />
              </Grid>
              <Grid item xs={12} lg={12} xl={6}>
                <Viewer row={proteinCodingCoordinatesRow} />
              </Grid>
            </Grid>
          </>
        );
      }}
      renderBody={() => {
        return (
          <OtTable
            columns={columns}
            rows={rows}
            dataDownloader
            query={VARIANT_EFFECT_QUERY.loc.source.body}
            variables={variables}
            loading={request.loading}
          />
        );
      }}
    />
  );
}

export default Body;
