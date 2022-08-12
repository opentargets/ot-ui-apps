import React from 'react';
import { Query } from '@apollo/client/react/components';

import Header from './Header';
import BasePage from '../BasePage';


import ScrollToTop from '../../components/ScrollToTop';
import ErrorBoundary from '../../components/ErrorBoundary';

import StudyLocusGenes from '../../sections/studyLocus/Genes/StudyLocusGenes';
import CredibleSetsGroup from '../../sections/studyLocus/CredibleSetsGroup';
import ColocGWASTable from '../../sections/studyLocus/ColocGWASTable';
import GenePrioritisationTabs from '../../sections/studyLocus/GenePrioritisationTabs';
import ColocL2GTable from '../../sections/studyLocus/ColocL2GTable';
import Summary from '../../sections/studyLocus/Summary';

import STUDY_LOCUS_HEADER_QUERY from './StudyLocusHeaderQuery.gql';

const HALF_WINDOW = 250000;

class StudyLocusPage extends React.Component {
  render() {
    const { match } = this.props;
    const { studyId, indexVariantId } = match.params;

    const [chromosome, positionStr] = indexVariantId.split('_');
    const position = parseInt(positionStr);
    const start = position - HALF_WINDOW;
    const end = position + HALF_WINDOW;

    return (
      <BasePage>
        {/* TODO: rescue Page title
        <Helmet>
          <title>{this.state.pageHeader}</title>
        </Helmet> */}
        <ScrollToTop />
        <ErrorBoundary>
          <Query
            query={STUDY_LOCUS_HEADER_QUERY}
            variables={{
              studyId,
              variantId: indexVariantId,
            }}
          >
            {({ loading: headerLoading, data: dataHeader }) => (
              <Header loading={headerLoading} data={dataHeader} />
            )}
          </Query>

          <Summary variantId={indexVariantId} studyId={studyId} />
          <ColocL2GTable variantId={indexVariantId} studyId={studyId} />
          <ColocGWASTable variantId={indexVariantId} studyId={studyId} />
          <GenePrioritisationTabs variantId={indexVariantId} studyId={studyId} />
          <CredibleSetsGroup variantId={indexVariantId} studyId={studyId} start={start} end={end} chromosome={chromosome}/>
          <StudyLocusGenes chromosome={chromosome} start={start} end={end} />
        </ErrorBoundary>
      </BasePage>
    );
  }
}

export default StudyLocusPage;
