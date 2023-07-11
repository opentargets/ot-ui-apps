import { withStyles } from '@mui/styles';

const styles = theme => ({
  plotContainerSection: {
    padding: '4px 0',
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
});

function PlotContainerSection({ classes, children }) {
  return <div className={classes.plotContainerSection}>{children}</div>;
}

export default withStyles(styles)(PlotContainerSection);
