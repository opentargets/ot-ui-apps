import { Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ReactNode } from "react";

const useStyles = makeStyles((theme: Theme) => ({
  plotContainerSection: {
    padding: "4px 0",
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
}));

type PlotContainerSectionProps = {
  children: ReactNode;
};

function PlotContainerSection({ children }: PlotContainerSectionProps): ReactNode {
  const classes = useStyles();
  return <div className={classes.plotContainerSection}>{children}</div>;
}

export default PlotContainerSection;
