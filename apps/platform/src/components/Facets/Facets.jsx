import { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Skeleton,
} from '@mui/material';
import { Clear } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

import Facet from './Facet';
import {
  getFilters,
  hasAllChildrenChecked,
  hasAnyDescendantChecked,
  prepareFacetData,
  updateFacetCounts,
  setAllChildren,
  traverse,
} from './utils';

const useStyles = makeStyles({
  facetSummary: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    alignItems: 'center',
    display: 'flex',

    '& > div': {
      marginRight: '.5rem',
    },
  },
  subtitle1: {
    marginBottom: '1rem !important',
    fontWeight: 'bold !important',
  },
  subtitle2: {
    marginTop: '1rem !important',
    marginBottom: '1rem !important',
    fontWeight: 'bold !important',
  },
});

function Facets({ loading, data, onChange, type }) {
  const [facets, setFacets] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    if (!data) return;

    if (!facets.length) {
      setFacets(prepareFacetData(data));
    } else {
      setFacets(newFacets => updateFacetCounts(newFacets, data));
    }
  }, [data, facets.length]);

  const handleFilterChange = (changePath, value) => {
    const newFacets = [...facets];

    const [node, parent] = traverse(newFacets, changePath);

    const newValue = value ?? !node.checked;

    node.checked = newValue;
    if (!newValue && parent) parent.checked = false;
    if (parent && !parent.root && hasAllChildrenChecked(parent))
      parent.checked = true;
    setAllChildren(node, newValue);

    const filters = getFilters(newFacets);

    onChange(filters);
  };

  const handleClickClear = () => {
    const newFacets = [...facets];

    newFacets.forEach(facet => {
      setAllChildren(facet, false);
    });

    const filters = getFilters(newFacets);

    onChange(filters);
  };

  return (
    <>
      <Box className={classes.facetSummary}>
        <h3>Filter by</h3>
        {loading && facets.length > 0 && (
          // Facets update, show a loading indicator
          <Box className={classes.loadingContainer}>
            <CircularProgress size={24} /> Updating facets...
          </Box>
        )}
        {hasAnyDescendantChecked(facets) && (
          <IconButton disabled={loading} onClick={handleClickClear}>
            <Clear />
          </IconButton>
        )}
      </Box>

      {loading && facets.length === 0 && (
        // Initial load, show skeleton
        <Skeleton variant="rect" height={48} />
      )}
      {facets.length > 0 && (
        <>
          <Typography className={classes.subtitle1}>
            Evidence-specific filters
          </Typography>
          <Facet
            loading={loading}
            key={facets[0].nodeId}
            treeId={facets[0].nodeId}
            label={facets[0].label}
            aggs={facets[0].aggs}
            onSelectionChange={handleFilterChange}
            isPrivate={facets[0].isPrivate}
          />
          <Typography className={classes.subtitle2}>
            {type === 'target' ? 'Target' : 'Disease/phenotype'}-specific
            filters
          </Typography>
          {facets.slice(1).map(facet => (
            <Facet
              loading={loading}
              key={facet.nodeId}
              treeId={facet.nodeId}
              label={facet.label}
              aggs={facet.aggs}
              onSelectionChange={handleFilterChange}
              isPrivate={facet.isPrivate}
            />
          ))}
        </>
      )}
    </>
  );
}

export default Facets;
