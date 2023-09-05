import { Children } from 'react';
import { Grid } from '@mui/material';

import summaryStyles from './summaryStyles';
import useSectionOrder from '../../hooks/useSectionOrder';

function SummaryContainer({ children }) {
  const classes = summaryStyles();
  const { sectionOrder } = useSectionOrder();

  return (
    <Grid
      id="summary-section"
      className={classes.summaryContainer}
      container
      spacing={1}
    >
      {sectionOrder.map(sectionId =>
        Children.toArray(children).find(
          child => child.props.definition.id === sectionId
        )
      )}
    </Grid>
  );
}

export default SummaryContainer;
