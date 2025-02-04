import { makeStyles, useTheme } from "@mui/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartBar } from "@fortawesome/free-solid-svg-icons";
import { Highlights, Link } from "ui";
import { Box, Typography } from "@mui/material";

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
      <Link to={`/variant/${data.id}`} className={classes.subtitle}>
        <FontAwesomeIcon icon={faChartBar} className={classes.icon} /> <>{data.traitFromSource}</>
      </Link>
      <Typography className={classes.subtitle} variant="subtitle1">
        {data.credibleSets.credibleSetsCount > -1 && (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
              <div>Credible sets count: {data.credibleSets.credibleSetsCount}</div>
              <div> • N Study: {data.nSamples}</div>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
              <div>
                {" "}
                {data.publicationFirstAuthor &&
                  `Publication author: ${data.publicationFirstAuthor}`}
              </div>
              <div> {data.publicationDate && ` •  Publication date: ${data.publicationDate}`}</div>
            </Box>
            <div>Study Type: {data.studyType}</div>
          </Box>
        )}
      </Typography>
      <Highlights highlights={highlights} />
    </div>
  );
}

export default StudyResult;
