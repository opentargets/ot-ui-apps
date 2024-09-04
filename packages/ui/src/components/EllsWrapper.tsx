import { makeStyles } from "@mui/styles";
import { ReactElement } from "react";

const useStyles = makeStyles(() => ({
  ellipseContainer: {
    display: "inline-block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "100%",
    verticalAlign: "bottom",
  },
}));

type EllsWrapperProps = {
  title?: string;
  children?: ReactElement | string;
};

function EllsWrapper({ children, title }: EllsWrapperProps): ReactElement {
  const classes = useStyles();

  return (
    <div className={classes.ellipseContainer} title={title || (children as string)}>
      {children}
    </div>
  );
}

export default EllsWrapper;
