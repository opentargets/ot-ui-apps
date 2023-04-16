import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

import { ChevronRight, Clear, ExpandMore } from '@material-ui/icons';
import { TreeView } from '@mui/lab';

import { hasAnyDescendantChecked } from './utils';
import TreeLevel from './TreeLevel';

const useStyles = makeStyles({
  accordionSummaryContent: {
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 0,
  },
  clearButtonRoot: {
    height: 'unset',
  },
  facetRoot: {
    width: '100%',
  },
});

function Facet({ loading, treeId, label, aggs, onSelectionChange }) {
  const classes = useStyles();

  const handleSelectionChange = newSelection => {
    onSelectionChange(newSelection);
  };

  const handleClickClear = event => {
    event.stopPropagation();
    onSelectionChange([treeId], false);
  };

  return (
    <Accordion>
      <AccordionSummary
        classes={{ content: classes.accordionSummaryContent }}
        expandIcon={<ExpandMore />}
      >
        <Typography>{label}</Typography>
        {hasAnyDescendantChecked(aggs) && (
          <IconButton
            className={classes.clearButtonRoot}
            disabled={loading}
            onClick={handleClickClear}
          >
            <Clear />
          </IconButton>
        )}
      </AccordionSummary>

      <AccordionDetails>
        <TreeView
          className={classes.facetRoot}
          defaultCollapseIcon={<ExpandMore />}
          defaultExpandIcon={<ChevronRight />}
        >
          <TreeLevel
            loading={loading}
            levelId={treeId}
            aggs={aggs}
            onSelectionChange={handleSelectionChange}
          />
        </TreeView>
      </AccordionDetails>
    </Accordion>
  );
}

export default Facet;
