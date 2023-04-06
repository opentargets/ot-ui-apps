import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';

const useStyles = makeStyles(theme => ({
  base: {
    fontFamily: 'Inter',
    fontSize: 'inherit',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },
  baseDefault: {
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.dark,
    },
  },
  baseTooltip: {
    color: 'white',
    '&:hover': {
      color: theme.palette.primary.light,
    },
    textDecoration: 'underline',
  },
  baseFooter: {
    color: 'white',
    '&:hover': {
      color: theme.palette.primary.light,
    },
    display: 'flex',
    alignItems: 'center',
  },
  externalIcon: {
    fontSize: '70%',
    verticalAlign: 'baseline',
    marginLeft: '3px',
    width: 'auto',
    height: 'auto',
    display: 'inline',
  },
}));

function Link({
  children,
  to,
  onClick,
  external,
  footer,
  tooltip,
  className,
}: {
  onClick: () => void;
  tooltip: string;
  className?: string;
  footer: boolean;
  external: boolean;
  to: string;
  children: React.ReactNode;
}) {
  const classes = useStyles();
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
      target="_blank"
      rel="noopener noreferrer"
      href={to}
      onClick={onClick}
    >
      {children}
      {footer ? null : (
        <Icon
          className={classNames(
            'fa',
            'fa-external-link-alt',
            classes.externalIcon
          )}
        />
      )}
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
      {children}
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
  to: '/',
};

export { Link };

export default Link;
