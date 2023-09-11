import { useQuery } from "@apollo/client";
import { Link, SectionItem, Tooltip } from "ui";

import { definition } from ".";
import Description from "./Description";
import DRUG_WARNINGS_QUERY from "./DrugWarningsQuery.gql";
import { DataTable, TableDrawer } from "../../components/Table";
import { naLabel, defaultRowsPerPageOptions } from "../../constants";

const replaceSemicolonWithUnderscore = (id) => id.replace(":", "_");

const columns = [
  {
    id: "warningType",
    label: "Warning type",
  },
  {
    id: "efoTerm",
    label: "Adverse event",
    renderCell: ({ efoTerm, efoId, description }) => {
      if (efoId)
        return (
          <Tooltip title={`Description: ${description}`} showHelpIcon>
            <Link to={`/disease/${replaceSemicolonWithUnderscore(efoId)}`}>
              {efoTerm || efoId}
            </Link>
          </Tooltip>
        );
      return efoTerm || description || naLabel;
    },
  },
  {
    id: "toxicityClass",
    label: "ChEMBL warning class",
    renderCell: ({ toxicityClass, efoIdForWarningClass, description }) => {
      if (efoIdForWarningClass)
        return (
          <Link
            external
            to={`/disease/${replaceSemicolonWithUnderscore(
              efoIdForWarningClass
            )}`}
          >
            {toxicityClass || efoIdForWarningClass}
          </Link>
        );
      return toxicityClass || description || naLabel;
    },
  },
  {
    id: "country",
    label: "Country / region",
    renderCell: ({ country }) => country ?? naLabel,
  },
  { id: "year", label: "Year", renderCell: ({ year }) => year ?? naLabel },
  {
    id: "references",
    label: "References",
    renderCell: ({ references }) => {
      const sources = new Set(); // used to collect unique sources
      const refs = [];

      references.forEach((ref) => {
        sources.add(ref.source); // add source to set
        refs.push({
          // create new entry object
          name: ref.id,
          url: ref.url,
          group: ref.source,
        });
      });

      const message = Array.from(sources).join(", ");

      return (
        <TableDrawer entries={refs} showSingle={false} message={message} />
      );
    },
  },
];

function Body({ id: chemblId, label: name, entity }) {
  const variables = { chemblId };
  const request = useQuery(DRUG_WARNINGS_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      request={request}
      entity={entity}
      renderDescription={() => <Description name={name} />}
      renderBody={({ drug }) => (
        <DataTable
          showGlobalFilter
          dataDownloader
          columns={columns}
          rows={drug.drugWarnings}
          rowsPerPageOptions={defaultRowsPerPageOptions}
          query={DRUG_WARNINGS_QUERY.loc.source.body}
          variables={variables}
        />
      )}
    />
  );
}

export default Body;
