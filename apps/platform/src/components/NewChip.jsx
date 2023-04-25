import classNames from 'classnames';
import { Chip as MUIChip, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  chip: {
    height: '20px',
    marginRight: '4px',
    marginBottom: '4px',
    maxWidth: '100%',
    backgroundColor: '#fafafa',
  },
});

const NewChip = ({ className }) => {
  const classes = useStyles();
  return (
    <MUIChip
      className={classNames(classes.chip, className)}
      label="new"
      variant="outlined"
      size="small"
    />
  );
};

export default NewChip;
