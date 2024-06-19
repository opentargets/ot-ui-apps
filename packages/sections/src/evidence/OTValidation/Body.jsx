import { useQuery } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link, SectionItem, ChipList, DataTable } from "ui";

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

function HitIcon({ isHitValue, classes }) {
  return (
    <FontAwesomeIcon
      icon={isHitValue ? faCheckCircle : faTimesCircle}
      size="2x"
      className={isHitValue ? classes.primaryColor : classes.grey}
    />
  );
}

const getColumns = classes => [
  {
    id: "disease",
    label: "Reported disease",
    renderCell: row => <Link to={`/disease/${row.disease.id}`}>{row.disease.name}</Link>,
    filterValue: row => `${row.diseaseLabel}, ${row.diseaseId}`,
  },
  {
    id: "projectDescription",
    label: "OTAR primary project",
    tooltip: <>Binary assessment of gene perturbation effect in primary project screen</>,
    renderCell: row => (
      <Link to={`http://home.opentargets.org/${row.primaryProjectId}`} external>
        {row.projectDescription}
        <Typography variant="caption" display="block">
          {row.primaryProjectId}
        </Typography>
      </Link>
    ),
    filterValue: row => `${row.projectDescription}, ${row.primaryProjectId}`,
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
    id: "assays",
    label: "VL hit",
    renderCell: ({ assays }) => (
      <ChipList
        small
        items={assays.map(e => ({
          label: ASSAYS_DISPLAY_NAME_MAPPING[e.shortName],
          tooltip: e.description,
          customClass: !e.isHit && classes.hsDefault,
        }))}
      />
    ),
  },
  {
    id: "primaryProjectHit",
    label: "Primary project hit",
    renderCell: ({ primaryProjectHit }) => (
      <HitIcon isHitValue={primaryProjectHit} classes={classes} />
    ),
    width: "8%",
  },
  {
    id: "assessment",
    label: "VL assessment",
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
