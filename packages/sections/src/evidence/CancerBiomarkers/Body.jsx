import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import {
  Link,
  Tooltip,
  SectionItem,
  PublicationsDrawer,
  DataTable,
  TableDrawer,
} from "ui";
import { naLabel } from "ui/src/constants";

import { defaultRowsPerPageOptions } from "../../constants";
import { epmcUrl } from "../../utils/urls";
import Description from "./Description";
import BiomarkersDrawer from "./BiomarkersDrawer";
import { definition } from ".";

import CANCER_BIOMARKERS_EVIDENCE_QUERY from "./CancerBiomarkersEvidence.gql";

const getColumns = (label) => [
  {
    id: "disease.name",
    label: "Disease",
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
    id: "biomarkerName",
    label: "Biomarker",
    renderCell: ({ biomarkerName, biomarkers }) => (
      <BiomarkersDrawer biomarkerName={biomarkerName} biomarkers={biomarkers} />
    ),
  },
  {
    id: "drug",
    label: "Reported drug",
    renderCell: ({ drug, drugFromSource }) =>
      drug ? <Link to={`/drug/${drug.id}`}>{drug.name}</Link> : drugFromSource,
    filterValue: ({ drug, drugFromSource }) =>
      drug ? drug.name : drugFromSource,
  },
  {
    id: "drugResponse.name",
    label: "Drug response",
    renderCell: ({ drugResponse }) =>
      (drugResponse && (
        <Link to={`/disease/${drugResponse.id}`}>{drugResponse.name}</Link>
      )) ||
      naLabel,
  },
  {
    id: "confidence",
    label: "Source",
    renderCell: ({ confidence, urls }) => {
      const entries = urls
        ? urls.map((url) => ({
            url: url.url,
            name: url.niceName,
            group: "Sources",
          }))
        : [];
      return <TableDrawer entries={entries} message={confidence} />;
    },
  },
  {
    id: "literature",
    label: "Literature",
    renderCell: ({ literature }) => {
      const entries = literature
        ? literature.map((id) => ({
            name: id,
            url: epmcUrl(id),
            group: "literature",
          }))
        : [];

      return (
        <PublicationsDrawer
          entries={entries}
          symbol={label.symbol}
          name={label.name}
        />
      );
    },
  },
];

function Body({ id, label, entity }) {
  const { ensgId, efoId } = id;

  const variables = {
    ensemblId: ensgId,
    efoId,
  };

  const request = useQuery(CANCER_BIOMARKERS_EVIDENCE_QUERY, {
    variables,
  });

  const columns = getColumns(label);

  return (
    <SectionItem
      definition={definition}
      chipText={definition.dataType}
      request={request}
      entity={entity}
      renderDescription={() => (
        <Description symbol={label.symbol} diseaseName={label.name} />
      )}
      renderBody={({ disease }) => {
        const { rows } = disease.cancerBiomarkersSummary;
        return (
          <DataTable
            columns={columns}
            rows={rows}
            dataDownloader
            showGlobalFilter
            rowsPerPageOptions={defaultRowsPerPageOptions}
            query={CANCER_BIOMARKERS_EVIDENCE_QUERY.loc.source.body}
            variables={variables}
          />
        );
      }}
    />
  );
}

export default Body;
