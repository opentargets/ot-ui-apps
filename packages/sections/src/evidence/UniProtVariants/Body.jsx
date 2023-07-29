import { useQuery } from "@apollo/client";
import { Typography, Chip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link, SectionItem, Tooltip } from "ui";

import { definition } from ".";
import Description from "./Description";
import { epmcUrl } from "../../utils/urls";
import { dataTypesMap } from "../../dataTypes";
import { DataTable } from "../../components/Table";
import { identifiersOrgLink } from "../../utils/global";
import { defaultRowsPerPageOptions } from "../../constants";
import UNIPROT_VARIANTS_QUERY from "./UniprotVariantsQuery.gql";
import { PublicationsDrawer } from "../../components/PublicationsDrawer";

const useStyles = makeStyles({
  xsmall: {
    fontSize: "0.7rem",
  },
  chipLink: {
    marginLeft: "5px",
  },
});

function getColumns(classes) {
  return [
    {
      id: "disease.name",
      label: "Disease/phenotype",
      renderCell: ({ disease, diseaseFromSource }) => (
        <Tooltip
          title={
            <>
              <Typography variant="subtitle2" display="block" align="center">
                Reported disease or phenotype:
              </Typography>
              <Typography variant="caption" display="block" align="center">
                {diseaseFromSource}
              </Typography>
            </>
          }
          showHelpIcon
        >
          <Link to={`/disease/${disease.id}`}>{disease.name}</Link>
        </Tooltip>
      ),
    },
    {
      id: "targetFromSourceId",
      label: "Reported protein",
      renderCell: ({ targetFromSourceId }) => (
        <Link external to={identifiersOrgLink("uniprot", targetFromSourceId)}>
          {targetFromSourceId}
        </Link>
      ),
    },
    {
      id: "variantRsId",
      label: "Variant",
      renderCell: ({ variantRsId }) => (
        <Link
          external
          to={`http://www.ensembl.org/Homo_sapiens/Variation/Explore?v=${variantRsId}`}
        >
          {variantRsId}
        </Link>
      ),
    },
    {
      id: "variantFunctionalConsequenceId",
      label: "Functional Consequence",
      renderCell: ({ variantRsId }) => {
        return (
          <Link
            external
            to={`https://www.ebi.ac.uk/ProtVar/query?search=${variantRsId}`}
            className={classes.chipLink}
          >
            <Chip
              label="ProtVar"
              size="small"
              color="primary"
              clickable
              variant="outlined"
              className={classes.xsmall}
            />
          </Link>
        );
      },
    },
    {
      id: "confidence",
      label: "Confidence",
    },
    {
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

        return <PublicationsDrawer entries={literatureList} />;
      },
    },
  ];
}

export function Body({ id, label, entity }) {
  const { ensgId, efoId } = id;

  const variables = {
    ensemblId: ensgId,
    efoId,
  };
  const classes = useStyles();
  const columns = getColumns(classes);

  const request = useQuery(UNIPROT_VARIANTS_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      chipText={dataTypesMap.genetic_association}
      request={request}
      entity={entity}
      renderDescription={() => (
        <Description symbol={label.symbol} diseaseName={label.name} />
      )}
      renderBody={({ disease }) => {
        const { rows } = disease.uniprotVariantsSummary;
        return (
          <DataTable
            columns={columns}
            rows={rows}
            dataDownloader
            showGlobalFilter
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
