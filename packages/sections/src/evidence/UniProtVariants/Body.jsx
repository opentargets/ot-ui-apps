import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import { Link, SectionItem, Tooltip, PublicationsDrawer, LabelChip, OtTable } from "ui";

import { definition } from ".";

import Description from "./Description";
import { epmcUrl } from "../../utils/urls";
import { dataTypesMap } from "../../dataTypes";
import { identifiersOrgLink } from "../../utils/global";
import {
  defaultRowsPerPageOptions,
  variantConsequenceSource,
  sectionsBaseSizeQuery,
} from "../../constants";
import UNIPROT_VARIANTS_QUERY from "./UniprotVariantsQuery.gql";

function getColumns(label) {
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
      id: "variantConsequence",
      label: "Variant Consequence",
      renderCell: ({ variantRsId }) => (
        <div style={{ display: "flex", gap: "5px" }}>
          <LabelChip
            label={variantConsequenceSource.ProtVar.label}
            to={`https://www.ebi.ac.uk/ProtVar/query?search=${variantRsId}`}
            tooltip={variantConsequenceSource.ProtVar.tooltip}
          />
        </div>
      ),
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
          <PublicationsDrawer entries={literatureList} symbol={label.symbol} name={label.name} />
        );
      },
    },
  ];
}

export function Body({ id, label, entity }) {
  const { ensgId, efoId } = id;

  const variables = {
    ensemblId: ensgId,
    efoId,
    size: sectionsBaseSizeQuery,
  };
  const columns = getColumns(label);

  const request = useQuery(UNIPROT_VARIANTS_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      chipText={dataTypesMap.genetic_association}
      request={request}
      entity={entity}
      renderDescription={() => <Description symbol={label.symbol} diseaseName={label.name} />}
      renderBody={({ disease }) => {
        const { rows } = disease.uniprotVariantsSummary;
        return (
          <OtTable
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
