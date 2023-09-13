import { makeStyles } from "@mui/styles";
import { Typography } from "@mui/material";

const useStyles = makeStyles(() => ({
  container: {
    position: "absolute",
    right: "2%",
  },
}));

function PublicationSummaryLabel() {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <b>
        <Typography variant="caption">Powered by OpenAI</Typography>
      </b>
    </div>
  );
}

export default PublicationSummaryLabel;
