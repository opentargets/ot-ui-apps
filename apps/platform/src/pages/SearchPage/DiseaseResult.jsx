import React from 'react';
import { Typography } from '@mui/material';
import { withStyles } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStethoscope } from '@fortawesome/free-solid-svg-icons';

import { LongText } from 'ui';

import Highlights from '../../components/Highlights';
import Link from '../../components/Link';

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

const DiseaseResult = ({ classes, data, highlights }) => {
  return (
    <div className={classes.container}>
      <Link
        to={`/disease/${data.id}/associations`}
        className={classes.subtitle}
      >
        <FontAwesomeIcon icon={faStethoscope} className={classes.icon} />{' '}
        {data.name}
      </Link>
      {data.description && (
        <Typography variant="body2" component="div">
          <LongText lineLimit="4">{data.description}</LongText>
        </Typography>
      )}
      <Highlights highlights={highlights} />
    </div>
  );
};

export default withStyles(styles)(DiseaseResult);
