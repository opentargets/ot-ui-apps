import { useQuery } from "@apollo/client";
import { Typography } from "@material-ui/core";
import { Link, Tooltip, SectionItem } from "ui";
import { DataTable } from "../../components/Table";
import { defaultRowsPerPageOptions, naLabel } from "../../constants";
import { dataTypesMap } from "../../dataTypes";
import Description from "./Description";
import { definition } from ".";

import CLINGEN_QUERY from "./ClingenQuery.gql";

const columns = [
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
    id: "allelicRequirements",
    label: "Allelic requirement",
    renderCell: ({ allelicRequirements }) => {
      if (!allelicRequirements) return naLabel;
      if (allelicRequirements.length === 1) return allelicRequirements[0];

      return (
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: "none",
          }}
        >
          {allelicRequirements.map((allelicRequirement) => (
            <li key={allelicRequirement}>{allelicRequirement}</li>
          ))}
        </ul>
      );
    },
    filterValue: ({ allelicRequirements }) =>
      allelicRequirements ? allelicRequirements.join() : "",
  },
  {
    id: "confidence",
    label: "Classification",
    renderCell: ({ confidence, urls }) => (
      <Tooltip
        title={
          <Typography variant="caption" display="block" align="center">
            As defined by the{" "}
            <Link
              external
              to="https://thegencc.org/faq.html#validity-termsdelphi-survey"
            >
              GenCC Guidelines
            </Link>
          </Typography>
        }
        showHelpIcon
      >
        {urls && urls[0]?.url ? (
          <Link external to={urls[0].url}>
            {confidence}
          </Link>
        ) : (
          confidence
        )}
      </Tooltip>
    ),
  },
];

function Body({ id, label }) {
  const { ensgId, efoId } = id;

  const variables = {
    ensemblId: ensgId,
    efoId,
  };

  const request = useQuery(CLINGEN_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      chipText={dataTypesMap.genetic_association}
      request={request}
      renderDescription={() => (
        <Description symbol={label.symbol} diseaseName={label.name} />
      )}
      renderBody={({ disease }) => {
        const { rows } = disease.evidences;
        return (
          <DataTable
            columns={columns}
            rows={rows}
            dataDownloader
            showGlobalFilter
            rowsPerPageOptions={defaultRowsPerPageOptions}
            query={CLINGEN_QUERY.loc.source.body}
            variables={variables}
          />
        );
      }}
    />
  );
}

export default Body;
