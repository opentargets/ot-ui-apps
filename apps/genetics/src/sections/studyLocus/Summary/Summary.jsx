import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useQuery } from '@apollo/client';
import { Skeleton } from '@material-ui/lab';
import { Link, Typography, SectionHeading } from '../../../ot-ui-components';
import {
  commaSeparate,
  variantHasInfo,
  variantGetInfo,
  variantPopulations,
} from '../../../utils';

import STUDY_LOCUS_SUMMARY_QUERY from './StudyLocusSummary.gql';

const styles = () => ({
  value: {
    paddingLeft: '0.6rem',
    paddingRight: '1rem',
  },
});

function Summary({ classes, variantId }) {
  const { loading, data: queryResult } = useQuery(STUDY_LOCUS_SUMMARY_QUERY, {
    variables: { variantId },
  });

  return (
    <div>summary component</div>
  );
}

export default withStyles(styles)(Summary);
