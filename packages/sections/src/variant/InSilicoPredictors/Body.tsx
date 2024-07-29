import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import { SectionItem, Tooltip, DataTable } from "ui";
import { definition } from "../InSilicoPredictors";
import Description from "../InSilicoPredictors/Description";
import { defaultRowsPerPageOptions, naLabel } from "../../constants";
import IN_SILICO_PREDICTORS_QUERY from "./InSilicoPredictorsQuery.gql";

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
      renderDescription={() => <Description variantId={id} />}
      renderBody={({ variant }) => {
        const rows = [...variant.inSilicoPredictors].sort((row1, row2) => {
          return row1.method.localeCompare(row2.method);
        });
        return (
          <DataTable
            columns={columns}
            rows={rows}
            dataDownloader
            rowsPerPageOptions={defaultRowsPerPageOptions}
            query={IN_SILICO_PREDICTORS_QUERY.loc.source.body}
            variables={variables}
          />
        );
      }}
    />
  );
}

export default Body;
