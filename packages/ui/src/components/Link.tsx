import { ReactNode } from "react";
import PropTypes from "prop-types";
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
}: {
  className?: string;
  to: string;
  onClick?: () => void;
  external: boolean;
  newTab?: boolean;
  footer: boolean;
  tooltip?: unknown;
  children: ReactNode;
  ariaLabel?: string;
}) {
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

Link.propTypes = {
  /** Whether the link directs to an external site. */
  external: PropTypes.bool,
  /** Whether the link is used within the footer section. */
  footer: PropTypes.bool,
  /** Whether the link is used within a tooltip. */
  tooltip: PropTypes.bool,
  /** The handler to call on click. */
  onClick: PropTypes.func,
  /** The url to visit on clicking the link. */
  to: PropTypes.string.isRequired,
};

Link.defaultProps = {
  external: false,
  footer: false,
  tooltip: false,
  onClick: null,
  to: "/",
};

export default Link;
