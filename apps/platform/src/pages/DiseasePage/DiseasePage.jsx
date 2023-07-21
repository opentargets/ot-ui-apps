import { Suspense, lazy } from 'react';
import { useQuery } from '@apollo/client';
import { Tab, Tabs } from '@mui/material';
import { Link, Route, Switch, useLocation } from 'react-router-dom';
import { LoadingBackdrop } from 'ui';
import { v1 } from 'uuid';

import { getAbleRoutes, getClassicAssociationsURL } from '../../utils/urls';

import BasePage from '../../components/BasePage';
import Header from './Header';
import NotFoundPage from '../NotFoundPage';
import ScrollToTop from '../../components/ScrollToTop';

import DISEASE_PAGE_QUERY from './DiseasePage.gql';
import NewChip from '../../components/NewChip';
import usePermissions from '../../hooks/usePermissions';

const Profile = lazy(() => import('./Profile'));
const Associations = lazy(() => import('./DiseaseAssociations'));
const ClassicAssociations = lazy(() => import('./ClassicAssociations'));

function DiseasePageTabs({ efoId }) {
  const location = useLocation();
  const { isPartnerPreview } = usePermissions();
  const classicAssociationsPath = isPartnerPreview
    ? 'classic-associations'
    : 'associations';

  const routes = [
    {
      label: (
        <div>
          <NewChip />
          Associated targets
        </div>
      ),
      path: `/disease/${efoId}/associations`,
      private: true,
    },
    {
      label: 'Associated targets',
      path: `/disease/${efoId}/${classicAssociationsPath}`,
    },
    { label: 'Profile', path: `/disease/${efoId}` },
  ];

  const ableRoutes = getAbleRoutes({ routes, isPartnerPreview });
  const activeTabIndex = ableRoutes.findIndex(
    route => route.path === location.pathname
  );

  return (
    <Tabs value={activeTabIndex}>
      {ableRoutes.map(route => (
        <Tab key={v1()} label={route.label} component={Link} to={route.path} />
      ))}
    </Tabs>
  );
}

function DiseasePage({ location, match }) {
  const { efoId } = match.params;
  const { loading, data } = useQuery(DISEASE_PAGE_QUERY, {
    variables: { efoId },
  });

  const { isPartnerPreview } = usePermissions();
  const baseURL = '/disease/:ensgId/';
  const { fullURL: classicAssocURL } = getClassicAssociationsURL({
    baseURL,
    isPartnerPreview,
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
          {isPartnerPreview && (
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
          )}
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
