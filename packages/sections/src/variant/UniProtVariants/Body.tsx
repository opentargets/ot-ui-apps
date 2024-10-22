import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import { Link, SectionItem, Tooltip, PublicationsDrawer, DataTable } from "ui";
import { definition } from ".";
import Description from "./Description";
import { epmcUrl } from "../../utils/urls";
import { defaultRowsPerPageOptions, naLabel } from "../../constants";
import UNIPROT_VARIANTS_QUERY from "./UniProtVariantsQuery.gql";

const columns = [
  {
    id: "diseases",
    label: "Disease/phenotype",
    renderCell: ({ disease, diseaseFromSource }) => {
      if (!disease) return naLabel;
      const displayElement = <Link to={`/disease/${disease.id}`}>
        {disease.name}
      </Link>;
      if (diseaseFromSource) {
        return <Tooltip
          title={
            <>
              <Typography variant="subtitle2" display="block" align="center">
                Reported disease or phenotype
              </Typography>
              <Typography variant="caption" display="block" align="center">
                {diseaseFromSource}
              </Typography>
            </>
          }
          showHelpIcon
        >
          {displayElement}
        </Tooltip>
      }
      return displayElement;
    },
    exportValue: ({ disease }) => disease?.name,
    filterValue: ({ disease }) => disease?.name,
  },
  {
    id: "confidence",
    label: "Confidence",
  },
  {
    id: "literature",
    label: "Literature",
    renderCell: ({ literature }) => {
      const literatureList =
        literature?.reduce((acc, id) => {
          if (id !== "NA") {
            acc.push({
              name: id,
              url: epmcUrl(id),
              group: "literature",
            });
          }
          return acc;
        }, []) || [];
      return (
        <PublicationsDrawer entries={literatureList} />
      );
    },
    filterValue: false,
  },
];

type BodyProps = {
  id: string,
  entity: string,
};

export function Body({ id, entity }: BodyProps) {
  const variables = {
    variantId: id,
  };

  const request = useQuery(UNIPROT_VARIANTS_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      request={request}
      entity={entity}
      renderDescription={({ variant }) => (
        <Description
          variantId={variant.id}
          referenceAllele={variant.referenceAllele}
          alternateAllele={variant.alternateAllele}
          evidences={variant.evidences}
        />
      )}
      renderBody={({ variant }) => { 
        return (
          <DataTable
            dataDownloader
            showGlobalFilter
            columns={columns}
            rows={variant.evidences.rows}
            rowsPerPageOptions={defaultRowsPerPageOptions}
            query={UNIPROT_VARIANTS_QUERY.loc.source.body}
            variables={variables}
          />
        );
      }}
    />
  );
}

export default Body;