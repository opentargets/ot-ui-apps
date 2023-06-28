import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  container: {
    position: 'absolute',
    right: '2%',
  },
}));

function PublicationSummaryLabel() {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <b>
        <Typography variant="caption">Powerd by OpenAI</Typography>
      </b>
    </div>
  );
}

export default PublicationSummaryLabel;
