import { withStyles } from '@mui/style';

const styles = theme => ({
  levelBar: {
    backgroundColor: theme.palette.primary.main,
    borderRight: '1px solid white',
    height: '12px',
  },
  containerBar: {
    width: '100%',
    backgroundColor: `${theme.palette.grey[300]}`,
  },
});

function LevelBar({ classes, value, altTitle }) {
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

export default withStyles(styles)(LevelBar);
