import React from 'react';
import { Typography } from '@mui/material';
import { withStyles } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrescriptionBottleAlt } from '@fortawesome/free-solid-svg-icons';

import Highlights from '../../components/Highlights';
import Link from '../../components/Link';
import { LongText } from 'ui';

const styles = theme => ({
  container: {
    marginBottom: '30px',
  },
  subtitle: {
    fontSize: '20px',
    fontWeight: 500,
  },
  icon: {
    color: theme.palette.primary.main,
  },
});

const DrugResult = ({ classes, data, highlights }) => {
  return (
    <div className={classes.container}>
      <Link to={`drug/${data.id}`} className={classes.subtitle}>
        <FontAwesomeIcon
          icon={faPrescriptionBottleAlt}
          className={classes.icon}
        />{' '}
        {data.name}
      </Link>
      {data.description && (
        <Typography variant="body2" component="div">
          <LongText lineLimit={4}>{data.description}</LongText>
        </Typography>
      )}
      <Highlights highlights={highlights} />
    </div>
  );
};

export default withStyles(styles)(DrugResult);
