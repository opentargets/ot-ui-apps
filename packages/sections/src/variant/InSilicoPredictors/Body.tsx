// import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import { Link, SectionItem, Tooltip, PublicationsDrawer, DataTable } from "ui";
import { definition } from "../InSilicoPredictors";
import Description from "../InSilicoPredictors/Description";
import { epmcUrl } from "../../utils/urls";
import { identifiersOrgLink } from "../../utils/global";
import { defaultRowsPerPageOptions, naLabel, sectionsBaseSizeQuery,
} from "../../constants";
// import UNIPROT_VARIANTS_QUERY from "./UniprotVariantsQuery.gql";

function getColumns(label: string) {
  return [
    {
      id: "method",
      label: "Method",
    },
    {
      id: "assessment",
      label: "Prediction",
      renderCell: ({ assessment, flag }) => (
        flag
          ? (
            <Tooltip
              title={
                <>
                  <Typography variant="subtitle2" display="block" align="center">
                    Flag: {flag}
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

  // const variables = {
  //   ensemblId: ensgId,
  //   efoId,
  //   size: sectionsBaseSizeQuery,
  // };

  const columns = getColumns(label);

  // const request = useQuery(UNIPROT_VARIANTS_QUERY, {
  //   variables,
  // });
  const request = mockQuery();

  return (
    <SectionItem
      definition={definition}
      request={request}
      entity={entity}
      renderDescription={() => <Description variantId={id} />}
      renderBody={() => {
        // const rows = request.data.variant.inSilicoPredictors;
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
            // query={UNIPROT_VARIANTS_QUERY.loc.source.body}
            // variables={variables}
          />
        );
      }}
    />
  );
}

export default Body;

function mockQuery() {
  return {
    loading: false,
    error: undefined,
    data: JSON.parse(`
{ 
  "variant": {
    "inSilicoPredictors": [
      {
        "method": "alphaMissense",
        "score": 0.077,
        "assessment": "likely_benign"
      },
      {
        "method": "phred scaled CADD",
        "score": 7.293
      },
      {
        "method": "sift max",
        "score": 0.2,
        "assessment": "MODERATE"
      },
      {
        "method": "polyphen max",
        "score": 0.069,
        "assessment": "tolerated"
      },
      {
        "method": "loftee",
        "assessment": "high-confidence LoF variant",
        "flag": "PHYLOCSF_WEAK"
      }
    ]
  }
}`),
  };
}