import classNames from 'classnames';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  base: {
    fontSize: 'inherit',
    textDecoration: 'none',
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
}) {
  const classes = useStyles();
  const newTabProps = newTab
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};
  if (external) {
    return (
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
        // TODO: review props spreading
        // eslint-disable-next-line
        {...newTabProps}
      >
        {children}
      </a>
    );
  }
  return (
    <RouterLink
      className={classNames(
        classes.base,
        {
          [classes.baseDefault]: !footer && !tooltip,
          [classes.baseFooter]: footer,
          [classes.basetooltip]: tooltip,
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

export default Link;
