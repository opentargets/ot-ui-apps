import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import { Link, SectionItem, Tooltip, PublicationsDrawer, DataTable } from "ui";
import { definition } from "../InSilicoPredictors";
import Description from "../InSilicoPredictors/Description";
import { epmcUrl } from "../../utils/urls";
import { identifiersOrgLink } from "../../utils/global";
import { defaultRowsPerPageOptions, naLabel, sectionsBaseSizeQuery,
} from "../../constants";
import IN_SILICO_PREDICTORS_QUERY from "./InSilicoPredictorsQuery.gql";

function getColumns(label: string) {
  return [
    {
      id: "method",
      label: "Method",
    },
    {
      id: "assessment",
      label: "Prediction",
      renderCell: ({ assessment, assessmentFlag }) => (
        assessmentFlag
          ? (
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
          )
      )
    },
    {
      id: "score",
      label: "Score",
    },
  ];
}

type BodyProps = {
  id: string,
  label: string,
  entity: string,
};

export function Body({ id, label, entity }) {

  const variables = {
    variantId: id,
  };

  const columns = getColumns(label);

  const request = useQuery(IN_SILICO_PREDICTORS_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      request={request}
      entity={entity}
      renderDescription={() => <Description variantId={id} />}
      renderBody={() => {
        const rows =
          [...request.data.variant.inSilicoPredictors].sort((row1, row2) => {
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