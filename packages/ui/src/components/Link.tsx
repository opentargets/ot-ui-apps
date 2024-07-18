import { ReactElement, ReactNode } from "react";
import classNames from "classnames";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import Tooltip from "./Tooltip";

const useStyles = makeStyles(theme => ({
  base: {
    fontSize: "inherit",
    "text-decoration-color": "white",
    "-webkit-text-decoration-color": "white",
  },
  baseDefault: {
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.primary.dark,
      "text-decoration-color": theme.palette.primary.dark,
      "-webkit-text-decoration-color": theme.palette.primary.dark,
    },
  },
  baseTooltip: {
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.primary.dark,
    },
    textDecoration: "none",
  },
  baseFooter: {
    color: "white",
    "text-decoration-color": "transparent",
    "-webkit-text-decoration-color": "transparent",
    "&:hover": {
      color: theme.palette.primary.light,
      "text-decoration-color": theme.palette.primary.light,
      "-webkit-text-decoration-color": theme.palette.primary.light,
    },
    display: "flex",
    alignItems: "center",
  },
}));

type LinkPropTypes = {
  className?: string;
  to: string;
  onClick?: () => void;
  external: boolean;
  newTab?: boolean;
  footer: boolean;
  tooltip?: unknown;
  children: ReactNode;
  ariaLabel?: string;
};

const defaultProps: LinkPropTypes = {
  external: false,
  footer: false,
  tooltip: false,
  onClick: undefined,
  to: "/",
  children: null,
};

function Link({
  children,
  to,
  onClick,
  external,
  newTab,
  footer,
  tooltip,
  className,
  ariaLabel,
}: LinkPropTypes = defaultProps): ReactElement {
  const classes = useStyles();
  const ariaLabelProp = ariaLabel ? { "aria-label": ariaLabel } : {};
  const newTabProps = newTab ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return external ? (
    <a
      className={classNames(
        classes.base,
        {
          [classes.baseDefault]: !footer && !tooltip,
          [classes.baseFooter]: footer,
          [classes.baseTooltip]: tooltip,
        },
        className
      )}
      href={to}
      onClick={onClick}
      {...newTabProps}
      {...ariaLabelProp}
    >
      {children}
    </a>
  ) : (
    <RouterLink
      className={classNames(
        classes.base,
        {
          [classes.baseDefault]: !footer && !tooltip,
          [classes.baseFooter]: footer,
          [classes.baseTooltip]: tooltip,
        },
        className
      )}
      to={to}
      onClick={onClick}
    >
      <Tooltip title={tooltip}>{children}</Tooltip>
    </RouterLink>
  );
}

export default Link;
