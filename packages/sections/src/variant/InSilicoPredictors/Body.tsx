import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import { SectionItem, Tooltip, OtTable } from "ui";
import { definition } from "../InSilicoPredictors";
import Description from "../InSilicoPredictors/Description";
import { naLabel } from "../../constants";
import IN_SILICO_PREDICTORS_QUERY from "./InSilicoPredictorsQuery.gql";
import InSilicoPredictorsVisualisation from "./InSilicoPredictorsPlot";
import { VIEW } from "ui/src/constants";

const columns = [
  {
    id: "method",
    label: "Method",
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
    renderCell: ({ score }) => score ?? naLabel,
  },
  {
    id: "normalisedScore",
    label: "normalisedScore",
    renderCell: ({ normalisedScore }) => normalisedScore ?? naLabel,
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
  const request = useQuery(IN_SILICO_PREDICTORS_QUERY, {
    variables,
  });

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
      renderChart={() => (
        <InSilicoPredictorsVisualisation
          data={request.data.variant.inSilicoPredictors}
          query={IN_SILICO_PREDICTORS_QUERY.loc.source.body}
          variables={variables}
          columns={columns}
        />
      )}
      renderBody={() => {
        let rows = [];
        if (request.data)
          rows = [...request.data.variant.inSilicoPredictors].sort((row1, row2) => {
            return row1.method.localeCompare(row2.method);
          });
        return (
          <OtTable
            columns={columns}
            rows={rows}
            dataDownloader
            query={IN_SILICO_PREDICTORS_QUERY.loc.source.body}
            variables={variables}
            loading={request.loading}
          />
        );
      }}
    />
  );
}

export default Body;
