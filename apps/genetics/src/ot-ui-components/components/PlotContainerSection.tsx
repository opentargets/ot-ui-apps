import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  plotContainerSection: {
    padding: '4px 0',
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
}));

const PlotContainerSection = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.plotContainerSection}>{children}</div>;
};

export default PlotContainerSection;
