import Typography from '@mui/material/Typography';
import { withStyles } from '@mui/styles';
import classNames from 'classnames';

import usePermissions from '../hooks/usePermissions';

const styles = () => ({
  root: {
    display: 'inline',
  },
  fat: {
    fontWeight: 1100,
    textTransform: 'capitalize',
  },
  thin: {
    fontWeight: 300,
    textTransform: 'capitalize',
  },
});

function OpenTargetsTitle({ classes, className, name }) {
  const titleClasses = classNames(classes.root, className);
  const { isPartnerPreview } = usePermissions();
  const displayedAppName = isPartnerPreview ? 'Partner Preview Platform' : name;
  return (
    <Typography className={titleClasses} variant="h6" color="inherit">
      <span className={classes.fat}>Open Targets </span>
      <span className={classes.thin}>{displayedAppName}</span>
    </Typography>
  );
}

export default withStyles(styles)(OpenTargetsTitle);
