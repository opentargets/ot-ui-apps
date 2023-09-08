import { Suspense, lazy } from 'react';
import { useQuery } from '@apollo/client';
import { Box, Tab, Tabs } from '@mui/material';
import {
  Link,
  Route,
  Switch,
  useLocation,
  matchPath,
  useRouteMatch,
} from 'react-router-dom';
import { v1 } from 'uuid';
import { LoadingBackdrop } from 'ui';

import { getAbleRoutes, getClassicAssociationsURL } from '../../utils/urls';

import BasePage from '../../components/BasePage';
import ScrollToTop from '../../components/ScrollToTop';
import Header from './Header';
import NotFoundPage from '../NotFoundPage';
import { getUniprotIds } from '../../utils/global';
import TARGET_PAGE_QUERY from './TargetPage.gql';
import NewChip from '../../components/NewChip';
import usePermissions from '../../hooks/usePermissions';

const Profile = lazy(() => import('./Profile'));
const Associations = lazy(() => import('./TargetAssociations'));
const ClassicAssociations = lazy(() => import('./ClassicAssociations'));

function TargetPageTabs({ ensgId }) {
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
          Associated diseases
        </div>
      ),
      path: `/target/${ensgId}/associations`,
      private: true,
    },
    {
      label: 'Associated diseases',
      path: `/target/${ensgId}/${classicAssociationsPath}`,
    },
    { label: 'Profile', path: `/target/${ensgId}` },
  ];

  const ableRoutes = getAbleRoutes({ routes, isPartnerPreview });

  function findMatchingRoute(patterns) {
    const { pathname } = useLocation();

    for (let i = 0; i < patterns.length; i += 1) {
      const pattern = patterns[i];
      const possibleMatch = useRouteMatch(pattern.path, pathname);
      if (possibleMatch !== null) {
        return possibleMatch;
      }
    }

    return null;
  }

  const routeMatch = findMatchingRoute(ableRoutes);
  const currentTab = routeMatch;

  const activeTabIndex = ableRoutes.findIndex(
    route => currentTab.path === route.path
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

function TargetPage({ location, match }) {
  const { ensgId } = match.params;
  const { loading, data } = useQuery(TARGET_PAGE_QUERY, {
    variables: { ensgId },
  });
  const { isPartnerPreview } = usePermissions();
  const baseURL = '/target/:ensgId/';
  const { fullURL: classicAssocURL } = getClassicAssociationsURL({
    baseURL,
    isPartnerPreview,
  });

  if (data && !data.target) {
    return <NotFoundPage />;
  }

  const { approvedSymbol: symbol, approvedName } = data?.target || {};
  const uniprotIds = loading ? null : getUniprotIds(data.target.proteinIds);
  const crisprId = data?.target.dbXrefs.find(
    p => p.source === 'ProjectScore'
  )?.id;

  return (
    <BasePage
      title={
        location.pathname.includes('associations')
          ? `Diseases associated with ${symbol}`
          : `${symbol} profile page`
      }
      description={
        location.pathname.includes('associations')
          ? `Ranked list of diseases and phenotypes associated with ${symbol}`
          : `Annotation information for ${symbol}`
      }
      location={location}
    >
      <ScrollToTop />
      <Header
        loading={loading}
        ensgId={ensgId}
        uniprotIds={uniprotIds}
        symbol={symbol}
        name={approvedName}
        crisprId={crisprId}
      />
      <TargetPageTabs ensgId={ensgId} />
      <Suspense fallback={<LoadingBackdrop />}>
        <Switch>
          <Route
            exact
            path="/target/:ensgId"
            render={routeProps => (
              <Profile
                match={routeProps.match}
                location={routeProps.location}
                history={routeProps.history}
                ensgId={ensgId}
                symbol={symbol}
              />
            )}
          />
          {isPartnerPreview && (
            <Route
              path="/target/:ensgId/associations"
              render={routeProps => (
                <Associations
                  match={routeProps.match}
                  location={routeProps.location}
                  history={routeProps.history}
                  ensgId={ensgId}
                  symbol={symbol}
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
                ensgId={ensgId}
                symbol={symbol}
              />
            )}
          />
        </Switch>
      </Suspense>
    </BasePage>
  );
}

export default TargetPage;
