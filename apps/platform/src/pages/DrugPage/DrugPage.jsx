import { lazy } from 'react';
import { useQuery } from '@apollo/client';

import BasePage from '../../components/BasePage';
import ScrollToTop from '../../components/ScrollToTop';
import Header from './Header';
import NotFoundPage from '../NotFoundPage';
import { RoutingTab, RoutingTabs } from '../../components/RoutingTabs';
import DRUG_PAGE_QUERY from './DrugPage.gql';

const Profile = lazy(() => import('./Profile'));

function DrugPage({ location, match }) {
  const { chemblId } = match.params;
  const { loading, data } = useQuery(DRUG_PAGE_QUERY, {
    variables: { chemblId },
  });

  if (data && !data.drug) {
    return <NotFoundPage />;
  }

  const { name, crossReferences } = data?.drug || {};

  return (
    <BasePage
      title={`${name || chemblId} profile page`}
      description={`Annotation information for ${name || chemblId}`}
      location={location}
    >
      <Header
        loading={loading}
        chemblId={chemblId}
        name={name}
        crossReferences={crossReferences}
      />
      <ScrollToTop />

      <RoutingTabs>
        <RoutingTab
          label="Profile"
          path="/drug/:chemblId"
          // eslint-disable-next-line
          component={() => <Profile chemblId={chemblId} name={name} />}
        />
      </RoutingTabs>
    </BasePage>
  );
}

export default DrugPage;
