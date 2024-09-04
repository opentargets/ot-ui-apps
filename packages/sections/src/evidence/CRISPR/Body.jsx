import { Link as RouterLink } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Link } from "@mui/material";
import { SectionItem, TableDrawer, OtTable } from "ui";
import { dataTypesMap } from "../../dataTypes";
import { naLabel, sectionsBaseSizeQuery } from "../../constants";
import Description from "./Description";
import { definition } from ".";

import CRISPR_QUERY from "./CrisprQuery.gql";

const columns = [
  {
    id: "disease.name",
    label: "Disease/phenotype",
    renderCell: ({ disease }) => (
      <Link component={RouterLink} to={`/disease/${disease.id}`}>
        {disease.name}
      </Link>
    ),
  },
  {
    label: "Reported disease/phenotype",
    renderCell: ({ diseaseCellLines, diseaseFromSource }) => {
      if (!diseaseCellLines) return naLabel;

      const cellLines = diseaseCellLines.map(line => ({
        name: line.name,
        url: `https://cellmodelpassports.sanger.ac.uk/passports/${line.id}`,
        group: "Cancer Cell Lines",
      }));

      return (
        <TableDrawer
          entries={cellLines}
          message={`${diseaseCellLines.length} ${diseaseFromSource} cell lines`}
        />
      );
    },
    filterValue: ({ diseaseFromSource }) => diseaseFromSource,
  },
  {
    id: "resourceScore",
    label: "Priority score",
    renderCell: ({ resourceScore }) => resourceScore.toFixed(3),
  },
];

function Body({ id, label, entity }) {
  const { ensgId, efoId } = id;

  const variables = {
    ensemblId: ensgId,
    efoId,
    size: sectionsBaseSizeQuery,
  };

  const request = useQuery(CRISPR_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      chipText={dataTypesMap.affected_pathway}
      request={request}
      entity={entity}
      renderDescription={() => <Description symbol={label.symbol} name={label.name} />}
      renderBody={({ disease }) => {
        const { rows } = disease.crisprSummary;
        return (
          <OtTable
            columns={columns}
            rows={rows}
            dataDownloader
            showGlobalFilter
            query={CRISPR_QUERY.loc.source.body}
            variables={variables}
          />
        );
      }}
    />
  );
}

export default Body;
