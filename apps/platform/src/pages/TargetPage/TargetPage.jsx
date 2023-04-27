import { lazy } from 'react';
import { useQuery } from '@apollo/client';

import BasePage from '../../components/BasePage';
import ScrollToTop from '../../components/ScrollToTop';
import Header from './Header';
import NotFoundPage from '../NotFoundPage';
import { getUniprotIds } from '../../utils/global';
import TARGET_PAGE_QUERY from './TargetPage.gql';
import NewChip from '../../components/NewChip';
import {
  RoutingTab,
  RoutingTabs,
  PrivateRoutingTab,
} from '../../components/RoutingTabs';

const Profile = lazy(() => import('./Profile'));

const Associations = lazy(() => import('./TargetAssociations'));
const ClassicAssociations = lazy(() => import('./ClassicAssociations'));

function TargetPage({ location, match }) {
  const { ensgId } = match.params;
  const { loading, data } = useQuery(TARGET_PAGE_QUERY, {
    variables: { ensgId },
  });

  if (data && !data.target) {
    return <NotFoundPage />;
  }

  const { approvedSymbol: symbol, approvedName } = data?.target || {};
  const uniprotIds = loading ? null : getUniprotIds(data.target.proteinIds);
  const crisprId = data?.target.dbXrefs.find(
    p => p.source === 'ProjectScore'
  )?.id;

  const ASSOCIATIONS_COMPONENT = (
    <Associations ensgId={ensgId} symbol={symbol} />
  );
  const CLASSIC_ASSOCIATIONS_COMPONENT = (
    <ClassicAssociations ensgId={ensgId} symbol={symbol} />
  );
  const PROFILE_COMPONENT = <Profile ensgId={ensgId} symbol={symbol} />;

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
      <RoutingTabs>
        <PrivateRoutingTab
          label={
            <div>
              <NewChip />
              Associated diseases
            </div>
          }
          path="/target/:ensgId/associations"
          component={ASSOCIATIONS_COMPONENT}
        />
        <RoutingTab
          label="Associated diseases"
          path={`${match.path}/classic-associations`}
          component={CLASSIC_ASSOCIATIONS_COMPONENT}
        />
        <RoutingTab
          label="Profile"
          path="/target/:ensgId"
          component={PROFILE_COMPONENT}
        />
      </RoutingTabs>
    </BasePage>
  );
}

export default TargetPage;
