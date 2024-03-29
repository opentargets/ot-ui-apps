import _ from "lodash";
import classNames from "classnames";
import { useQuery } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import { Box, Typography, Chip, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link, SectionItem, Tooltip, ChipList, DataTable } from "ui";

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
  circleUp: {
    marginRight: "10px",
  },
  hypotesisBox: {
    marginBottom: "2rem",
    paddingBottom: "1rem",
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
  bold: {
    fontWeight: 700,
  },
  // hypothesis status classes
  hsLegendChip: {
    width: theme.spacing(4),
  },
  hsGreen: {
    backgroundColor: "#407253 !important", // same as PPP green
    border: `1px solid ${theme.palette.grey[600]} !important`,
  },
  hsRed: {
    backgroundColor: "#9e1316 !important",
    border: `1px solid ${theme.palette.grey[600]} !important`,
  },
  hsWhite: {
    backgroundColor: "#ffffff !important",
    color: `${theme.palette.grey[600]} !important`,
    border: `1px solid ${theme.palette.grey[600]} !important`,
  },
  hsBlack: {
    backgroundColor: "#000 !important",
    border: `1px solid ${theme.palette.grey[600]} !important`,
  },
  hsBlue: {
    backgroundColor: "#3489ca !important",
    border: `1px solid ${theme.palette.grey[600]} !important`,
  },
  // in the unlikely case the hypothesis status is unavailable,
  // we don't want to display the primary green (for PPP)
  hsUndefined: {
    backgroundColor: `${theme.palette.grey[500]} !important`,
    border: `1px solid ${theme.palette.grey[600]} !important`,
  },
}));

const isHit = (conf, validatedConf) => {
  if (conf && validatedConf) {
    return conf.toLowerCase() === validatedConf.toLowerCase();
  }
  return conf.toLowerCase() === "significant";
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

// Map response hypotheses status to style and labels
const hypothesesStatus = [
  {
    status: "expected but not observed",
    expected: true,
    observed: false,
    styles: "hsRed",
  },
  {
    status: "observed and expected",
    expected: true,
    observed: true,
    styles: "hsGreen",
  },
  {
    status: "not expected and not observed",
    expected: false,
    observed: false,
    styles: "hsBlack",
  },
  {
    status: "observed but not expected",
    expected: false,
    observed: true,
    styles: "hsBlue",
  },
];

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
      <Link to={`http://home.opentargets.org/${row.projectId}`} external>
        {row.projectDescription}
        <Typography variant="caption" display="block">
          {row.projectId}
        </Typography>
      </Link>
    ),
    filterValue: row => `${row.projectDescription}, ${row.projectId}`,
  },
  {
    id: "contrast",
    label: "Contrast",
    renderCell: row => (
      <Tooltip title={row.studyOverview} showHelpIcon>
        {row.contrast}
      </Tooltip>
    ),
    filterValue: row => `${row.contrast}, ${row.studyOverview}`,
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
    id: "resourceScore",
    label: "Effect size",
    renderCell: row => row.resourceScore,
    numeric: true,
    width: "8%",
  },
  {
    id: "confidence",
    label: "OTVL hit",
    tooltip: <>Binary assessment of gene perturbation effect in contrast</>,
    renderCell: row => <HitIcon isHitValue={isHit(row.confidence)} classes={classes} />,
    width: "8%",
  },
  {
    id: "projectHit",
    label: "Primary project hit",
    renderCell: row => <HitIcon isHitValue={isHit(row.expectedConfidence)} classes={classes} />,
    width: "8%",
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
    label: "project description",
    exportValue: row => row.projectDescription,
  },
  {
    label: "project id",
    exportValue: row => row.projectId,
  },
  {
    label: "contrast",
    exportValue: row => row.contrast,
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
    label: "effect size",
    exportValue: row => row.resourceScore,
  },
  {
    label: "hit",
    exportValue: row => isHit(row.confidence),
  },
  {
    label: "primary project hit",
    exportValue: row => isHit(row.expectedConfidence),
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
        const hypothesis = _.uniqBy(
          rows.reduce(
            (prev, curr) =>
              prev.concat(
                curr.validationHypotheses.map(vht => ({
                  label: vht.name,
                  tooltip: vht.description,
                  customClass:
                    classes[
                      hypothesesStatus.find(s => s.status === vht.status)?.styles || "hsUndefined"
                    ],
                }))
              ),
            []
          ),
          "label"
          // sort alphabetically but move 'PAN-CO' at the end of the list
        ).sort((a, b) => (b.label === "PAN-CO" || a.label < b.label ? -1 : 1));

        return (
          <>
            <Box className={classes.hypotesisBox}>
              <Typography variant="subtitle1" gutterBottom className={classes.bold}>
                <Tooltip
                  title={
                    <>
                      This table provides an overarching summary of the target-disease association
                      in the context of the listed biomarkers, based on criteria described{" "}
                      <Link external to="http://home.opentargets.org/ppp-documentation">
                        here
                      </Link>
                      , as informed by the target performance across the whole cell line panel.
                      Colour-coding indicates whether a dependency was expected to be associated
                      with a biomarker (based on Project SCORE data) and whether it was observed as
                      such (based on OTVL data).
                    </>
                  }
                  showHelpIcon
                >
                  OTVL biomarker assessment for {label.symbol}
                </Tooltip>
              </Typography>

              {/** LEGEND */}
              <Box
                sx={{
                  mb: theme => theme.spacing(2),
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {hypothesesStatus.map(hs => (
                  <Box
                    key={hs.status}
                    sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
                  >
                    <Chip className={classNames(classes.hsLegendChip, classes[hs.styles])} />
                    <Box sx={{ p: theme => `0 ${theme.spacing(3)} 0 ${theme.spacing(1)}` }}>
                      <Box sx={{ display: "flex", flexDirection: "row" }}>
                        <Typography variant="caption">
                          <b>{hs.expected ? "Expected" : "Not expected"}</b> in OTAR primary project
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", flexDirection: "row" }}>
                        <Typography variant="caption">
                          <b>{hs.observed ? "Observed" : "Not observed"} </b>
                          in OTVL
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>

              {/** CHIP LIST */}
              <ChipList items={hypothesis} />
            </Box>

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
