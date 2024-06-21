import { useQuery } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import { Box, Chip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link, SectionItem, ChipList, DataTable, Tooltip } from "ui";
import { v1 } from "uuid";

import { definition } from ".";
import Description from "./Description";
import { dataTypesMap } from "../../dataTypes";
import { defaultRowsPerPageOptions, sectionsBaseSizeQuery } from "../../constants";
import VALIDATION_QUERY from "./OTValidationQuery.gql";

const useStyles = makeStyles(theme => ({
  primaryColor: {
    color: theme.palette.primary.main,
  },
  grey: {
    color: theme.palette.grey[300],
  },
  bold: {
    fontWeight: 700,
  },
  hsWhite: {
    backgroundColor: "#ffffff !important",
    color: `${theme.palette.grey[600]} !important`,
    border: `1px solid ${theme.palette.grey[600]} !important`,
  },
  hsDefault: {
    backgroundColor: `${theme.palette.grey[300]} !important`,
    color: `${theme.palette.grey[600]} !important`,
  },
}));

const ASSAYS_DISPLAY_NAME_MAPPING = {
  "CellTiter-Glo": "CellTiterGlo",
  Toxicity: "CellTox",
  Confluence: "Cell Confluence",
};

const getColumns = classes => [
  {
    id: "disease",
    label: "Reported disease",
    renderCell: row => <Link to={`/disease/${row.disease.id}`}>{row.disease.name}</Link>,
    sortable: true,
    filterValue: row => `${row.diseaseLabel}, ${row.diseaseId}`,
  },
  {
    id: "diseaseCellLines",
    label: "Cell line",
    renderCell: row => (
      <>
        {row.diseaseCellLines.map(line => (
          <Link
            to={`https://cellmodelpassports.sanger.ac.uk/passports/${line.id}`}
            external
            key={line.id}
          >
            {line.name}
          </Link>
        ))}
      </>
    ),
    filterValue: row => row.diseaseCellLines.map(line => `${line.name}, ${line.id}`).join(", "),
    width: "8%",
  },
  {
    id: "biomarkerList",
    label: "Cell line biomarkers",
    renderCell: row => (
      <ChipList
        small
        items={row.biomarkerList.map(bm => ({
          label: bm.name,
          tooltip: bm.description,
          customClass: classes.hsWhite,
        }))}
      />
    ),
    filterValue: row => row.biomarkerList.map(bm => `${bm.name}, ${bm.description}`).join(", "),
    width: "16%",
  },
  {
    id: "projectDescription",
    label: "OTAR primary project",
    renderCell: ({ primaryProjectId }) => (
      <Link to={`http://home.opentargets.org/${primaryProjectId}`} external>
        {primaryProjectId}
      </Link>
    ),
    filterValue: row => `${row.primaryProjectId}`,
  },
  {
    id: "primaryProjectHit",
    label: "Primary project hit",
    tooltip: <>Binary assessment of gene perturbation effect in primary project screen</>,
    renderCell: ({ primaryProjectHit }) => (
      <FontAwesomeIcon
        icon={primaryProjectHit ? faCheckCircle : faTimesCircle}
        size="2x"
        className={primaryProjectHit ? classes.primaryColor : classes.grey}
      />
    ),
    sortable: true,
    width: "8%",
  },
  {
    id: "assays",
    label: "OTVL hit",
    renderCell: ({ assays }) => {
      let sortedAssays = [...assays];
      if (sortedAssays.length >= 2) {
        sortedAssays.sort(function (a, b) {
          if (a.shortName < b.shortName) {
            return -1;
          }
          if (a.shortName > b.shortName) {
            return 1;
          }
          return 0;
        });
      }
      return (
        <>
          {sortedAssays.map(e => (
            <Box sx={{ my: theme => theme.spacing(0.3) }} key={v1()}>
              <Tooltip title={e.description}>
                <Chip
                  label={ASSAYS_DISPLAY_NAME_MAPPING[e.shortName]}
                  size="small"
                  color={e.isHit ? "primary" : "default"}
                />
              </Tooltip>
            </Box>
          ))}
        </>
      );
    },
  },
  {
    id: "assessment",
    label: "OTVL assessment",
    renderCell: ({ assessment }) => {
      // TODO: temp solution, assessment key should contain array
      const regex =
        /(Evidence of dependency)|(Evidence of toxicity)|(No evidence of dependency)|(No evidence of toxicity)|(Multiple evidence of dependency)/g;
      const listOfValues = assessment.match(regex);
      return (
        <>
          {listOfValues.map(e => (
            <Box sx={{ my: theme => theme.spacing(1) }} key={e}>
              {e}
            </Box>
          ))}
        </>
      );
    },
  },
  {
    id: "releaseVersion",
    label: "Release version",
    width: "8%",
  },
];

const exportColumns = [
  {
    label: "disease",
    exportValue: row => row.disease.name,
  },
  {
    label: "disease id",
    exportValue: row => row.disease.id,
  },
  {
    label: "project id",
    exportValue: row => row.primaryProjectId,
  },
  {
    label: "study overview",
    exportValue: row => row.studyOverview,
  },
  {
    label: "disease cell line",
    exportValue: row => row.diseaseCellLines.map(line => `${line.name} (${line.id})`),
  },
  {
    label: "biomarkers",
    exportValue: row => row.biomarkerList.map(bm => bm.name),
  },
  {
    label: "VL hit",
    exportValue: row => row.assays,
  },
  {
    label: "primaryProjectHit",
    exportValue: row => row.primaryProjectHit,
  },
  {
    label: "assessment",
    exportValue: row => row.assessment,
  },
  {
    label: "effect size",
    exportValue: row => row.resourceScore,
  },
];

function Body({ id, label, entity }) {
  const { ensgId, efoId } = id;
  const variables = { ensemblId: ensgId, efoId, size: sectionsBaseSizeQuery };
  const request = useQuery(VALIDATION_QUERY, {
    variables,
  });
  const classes = useStyles();

  return (
    <SectionItem
      definition={definition}
      chipText={dataTypesMap.ot_validation_lab}
      request={request}
      entity={entity}
      renderDescription={() => <Description symbol={label.symbol} name={label.name} />}
      renderBody={({ disease }) => {
        const { rows } = disease.otValidationSummary;
        return (
          <>
            <DataTable
              columns={getColumns(classes)}
              rows={rows}
              dataDownloader
              dataDownloaderColumns={exportColumns}
              dataDownloaderFileStem={`${ensgId}-${efoId}-otvalidation`}
              showGlobalFilter
              sortBy="resourceScore"
              order="des"
              fixed
              noWrap={false}
              noWrapHeader={false}
              rowsPerPageOptions={defaultRowsPerPageOptions}
              query={VALIDATION_QUERY.loc.source.body}
              variables={variables}
            />
          </>
        );
      }}
    />
  );
}

export default Body;
