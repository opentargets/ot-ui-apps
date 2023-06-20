import { Box, CircularProgress, makeStyles, styled } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    color: theme.palette.primary.main,
    background: theme.palette.grey['100'],
    width: 'auto',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    marginBottom: '15px',
  },
}));

const LoadingContainer = styled('div')({
  margin: '10px 0',
  textAlign: 'center',
});

function SummaryLoader() {
  const classes = useStyles();
  return (
    <LoadingContainer>
      <Box className={classes.container}>
        <CircularProgress color="inherit" />
      </Box>
      Loading summary
    </LoadingContainer>
  );
}

export default SummaryLoader;
