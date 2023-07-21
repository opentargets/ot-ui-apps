import { makeStyles } from '@mui/style';

const useStyles = makeStyles(theme => ({
  levelBar: {
    backgroundColor: theme.palette.primary.main,
    borderRight: '1px solid white',
    height: '12px',
  },
  containerBar: {
    width: '100%',
    backgroundColor: `${theme.palette.grey[300]}`,
  },
}));

function LevelBar({ value, altTitle }) {
  const classes = useStyles();
  return (
    <div className={classes.containerBar}>
      <div
        className={classes.levelBar}
        style={{
          width: `${value}%`,
        }}
        title={altTitle}
      />
    </div>
  );
}

export default LevelBar;
