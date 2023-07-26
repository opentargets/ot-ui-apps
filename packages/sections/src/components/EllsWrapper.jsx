import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  ellipseContainer: {
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '100%',
    verticalAlign: 'bottom',
  },
}));

function EllsWrapper({ children, title }) {
  const classes = useStyles();

  return (
    <div className={classes.ellipseContainer} title={title || children}>
      {children}
    </div>
  );
}

export default EllsWrapper;
