import React, { useState } from 'react';
import {
  Switch,
  Route,
  Link,
  useRouteMatch,
  useLocation,
} from 'react-router-dom';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Tabs,
  Tab,
} from '@material-ui/core';
import { useQuery } from '@apollo/client';

import ClassicAssociationsDAG from './ClassicAssociationsDAG';
import ClassicAssociationsBubbles from './ClassicAssociationsBubbles';
import NewAssociationsTable from './NewAssociationsTable';
import { Facets } from '../../components/Facets';
import Wrapper from './Wrapper';

import TARGET_FACETS_QUERY from './TargetFacets.gql';

function ClassicAssociations({ ensgId, symbol }) {
  const match = useRouteMatch();
  const location = useLocation();
  const [aggregationFilters, setAggregationFilters] = useState([]);
  const { loading, data } = useQuery(TARGET_FACETS_QUERY, {
    variables: { ensemblId: ensgId, aggregationFilters },
  });

  const handleChangeFilters = newFilters => {
    setAggregationFilters(newFilters);
  };

  const facetData = data?.target?.associatedDiseases.aggregations.aggs;

  return (
    <Grid style={{ marginTop: '8px' }} container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">
          {data ? (
            <>
              <strong>
                {data.target.associatedDiseases.count} diseases or phenotypes
              </strong>{' '}
              associated with <strong>{symbol}</strong>
            </>
          ) : (
            <strong>Loading...</strong>
          )}
        </Typography>
      </Grid>{' '}
      {/* <Grid item xs={12} lg={3}>
        <Card elevation={0}>
          <CardContent>
            <Facets
              loading={loading}
              data={facetData}
              onChange={handleChangeFilters}
              type="disease"
            />
          </CardContent>
        </Card>
      </Grid> */}
      <Grid item xs={12}>
        <Tabs value={location.pathname}>
          <Tab
            component={Link}
            value={match.url}
            label="Table"
            to={match.url}
          />
        </Tabs>
        <Card elevation={0} style={{ overflow: 'visible' }}>
          <CardContent>
            <Switch>
              <Route path={match.path}>
                <NewAssociationsTable
                  ensgId={ensgId}
                  // aggregationFilters={aggregationFilters}
                />
              </Route>
            </Switch>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default ClassicAssociations;
