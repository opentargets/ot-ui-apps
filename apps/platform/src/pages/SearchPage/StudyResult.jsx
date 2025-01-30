import { makeStyles, useTheme } from "@mui/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartBar } from "@fortawesome/free-solid-svg-icons";
import { Highlights, Link } from "ui";
import { Typography } from "@mui/material";

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
        <FontAwesomeIcon icon={faChartBar} className={classes.icon} /> <>{data.id}</>
      </Link>
      <Typography className={classes.subtitle} variant="subtitle1">
        {data.credibleSets.credibleSetsCount > -1 && (
          <>Credible sets count: {data.credibleSets.credibleSetsCount}</>
        )}
      </Typography>
      <Highlights highlights={highlights} />
    </div>
  );
}

export default StudyResult;
