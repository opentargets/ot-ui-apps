import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import { Link, SectionItem, Tooltip, DataTable } from "ui";
import { definition } from "../InSilicoPredictors";
import Description from "../InSilicoPredictors/Description";
import { defaultRowsPerPageOptions, naLabel } from "../../constants";
import { identifiersOrgLink } from "../../utils/global";
import VARIANT_EFFECT_PREDICTOR_QUERY from "./VarientEffectPredictorQuery.gql";

function getColumns() {
  return [
    {
      id: "transcriptId",
      label: "Transcript",
      tooltip: "Ensembl canonical transcript",
    },
    {
      id: "variantConsequences.label",   // !!!!!!!!!
      label: "Predicted consequence",
      tooltip: "Impact",
      renderCell: ({ variantConsequences }) => (
        //  STILL TO ADD COMMAS BETWEEN THE LINKS
        variantConsequences.length
          ? variantConsequences.map(({ id, label }) => (
              <Link
                key={id}
                external
                to={identifiersOrgLink("SO", id.slice(3))}
              >
                {label.replace(/_/g, ' ')}
              </Link>
            ))
          : naLabel
      )
    },
    {
      id: "???",
      label: "Consequence Score",
      renderCell: () => "???"
    },
    {
      id: "target.approvedName",   // !!!!!!
      label: "Gene",
      renderCell: ({ target }) => (
        <Link to={`../target/${target.id}`}>{target.id}</Link>  // !!! TEST !!!
      ),
    },
    {
      id: 'aminoAcidChange',
      label: 'Amino acid change'
    },
    {
      id: 'codons',
      label: 'Coding change'
    },
    {
      id: "distance",
      label: "Distance from footprint",
      renderCell: ({  distance = 0 }) => distance,  // CAN REMOVE WHEN API UPDATED SO DIST NEVER NULL
    },
    {
      id: "distanceFromTss",
      label: "Distance from start site",
      renderCell: () => "not in API yet",  // FIX WHEN ADDED TO API
    },
    {
      id: "lofteePrediction",
      label: "Loftee prediction",
    },
    {
      id: "Polyphen prediction",
      label: "polyphenPrediction",
    },
    {  // !!!!! HERE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      id: "",
      label: "",
    }
  ];
}

type BodyProps = {
  id: string,
  entity: string,
};

export function Body({ id, entity }: BodyProps) {

  const variables = {
    variantId: id,
  };

  const columns = getColumns();

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