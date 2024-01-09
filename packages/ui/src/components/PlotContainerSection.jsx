import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(theme => ({
  plotContainerSection: {
    padding: "4px 0",
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
}));

function PlotContainerSection({ children }) {
  const classes = useStyles();
  return <div className={classes.plotContainerSection}>{children}</div>;
}

export default PlotContainerSection;
