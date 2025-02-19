import { makeStyles, useTheme } from "@mui/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartBar } from "@fortawesome/free-solid-svg-icons";
import { Highlights, Link } from "ui";
import { Box, Typography } from "@mui/material";
import { getStudyItemMetaData } from "ui/src/constants";

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: "30px",
  },
  subtitle: {
    fontSize: "20px",
    fontWeight: 500,
  },
  icon: {
    color: theme.palette.primary.main,
  },
}));

function StudyResult({ data, highlights }) {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div className={classes.container}>
      <Link to={`/study/${data.id}`} className={classes.subtitle}>
        <FontAwesomeIcon icon={faChartBar} className={classes.icon} /> <>{data.traitFromSource}</>
      </Link>
      <Typography className={classes.subtitle} variant="subtitle1">
        {data.credibleSets.credibleSetsCount > -1 && (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
              <div>
                {getStudyItemMetaData({
                  studyType: data.studyType,
                  credibleSetsCount: data.credibleSets.credibleSetsCount,
                  nSamples: data.nSamples,
                })}
              </div>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
              <div>
                {" "}
                {data.publicationFirstAuthor && (
                  <>
                    {data.publicationFirstAuthor} <i>et al.</i> {data.publicationJournal} (
                    {data.publicationDate?.slice(0, 4)})
                  </>
                )}
              </div>
            </Box>
            <div>
              {data.target?.approvedSymbol && `Affected gene: ${data.target.approvedSymbol}  • `}
              {data.biosample?.biosampleName &&
                `Affected cell/tissue: ${data.biosample.biosampleName}`}
            </div>
          </Box>
        )}
      </Typography>
      <Highlights highlights={highlights} />
    </div>
  );
}

export default StudyResult;
