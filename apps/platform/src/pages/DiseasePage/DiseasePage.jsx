import { Suspense, lazy } from 'react';
import { useQuery } from '@apollo/client';
import { Box, Tab, Tabs } from '@mui/material';
import { Link, Route, Switch, useLocation } from 'react-router-dom';
import { LoadingBackdrop, BasePage, NewChip, ScrollToTop } from 'ui';
import { v1 } from 'uuid';

import { getAbleRoutes, getClassicAssociationsURL } from '../../utils/urls';

import Header from './Header';
import NotFoundPage from '../NotFoundPage';

import DISEASE_PAGE_QUERY from './DiseasePage.gql';

const Profile = lazy(() => import('./Profile'));
const Associations = lazy(() => import('./DiseaseAssociations'));
const ClassicAssociations = lazy(() => import('./ClassicAssociations'));

function DiseasePageTabs({ efoId }) {
  const location = useLocation();

  const routes = [
    {
      label: (
        <div>
          Associated targets
          <NewChip />
        </div>
      ),
      path: `/disease/${efoId}/associations`,
    },
    {
      label: 'Associated targets',
      path: `/disease/${efoId}/classic-associations`,
    },
    { label: 'Profile', path: `/disease/${efoId}` },
  ];

  const ableRoutes = getAbleRoutes({ routes });
  const activeTabIndex = ableRoutes.findIndex(
    route => route.path === location.pathname
  );

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={activeTabIndex}>
        {ableRoutes.map(route => (
          <Tab
            key={v1()}
            label={
              <Box sx={{ textTransform: 'capitalize' }}>{route.label}</Box>
            }
            component={Link}
            to={route.path}
          />
        ))}
      </Tabs>
    </Box>
  );
}

function DiseasePage({ location, match }) {
  const { efoId } = match.params;
  const { loading, data } = useQuery(DISEASE_PAGE_QUERY, {
    variables: { efoId },
  });

  const baseURL = '/disease/:ensgId/';
  const { fullURL: classicAssocURL } = getClassicAssociationsURL({
    baseURL,
  });

  if (data && !data.disease) {
    return <NotFoundPage />;
  }

  const { name, dbXRefs } = data?.disease || {};

  return (
    <BasePage
      title={
        location.pathname.includes('associations')
          ? `Targets associated with ${name}`
          : `${name} profile page`
      }
      description={
        location.pathname.includes('associations')
          ? `Ranked list of targets associated with ${name}`
          : `Annotation information for ${name}`
      }
      location={location}
    >
      <Header loading={loading} efoId={efoId} name={name} dbXRefs={dbXRefs} />
      <ScrollToTop />
      <DiseasePageTabs efoId={efoId} />
      <Suspense fallback={<LoadingBackdrop />}>
        <Switch>
          <Route
            exact
            path="/disease/:efoId"
            render={routeProps => (
              <Profile
                match={routeProps.match}
                location={routeProps.location}
                history={routeProps.history}
                efoId={efoId}
                name={name}
              />
            )}
          />
          <Route
            path="/disease/:efoId/associations"
            render={routeProps => (
              <Associations
                match={routeProps.match}
                location={routeProps.location}
                history={routeProps.history}
                efoId={efoId}
                name={name}
              />
            )}
          />
          <Route
            path={classicAssocURL}
            render={routeProps => (
              <ClassicAssociations
                match={routeProps.match}
                location={routeProps.location}
                history={routeProps.history}
                efoId={efoId}
                name={name}
              />
            )}
          />
        </Switch>
      </Suspense>
    </BasePage>
  );
}

export default DiseasePage;
