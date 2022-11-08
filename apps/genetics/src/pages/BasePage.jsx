import React from 'react';
import { Helmet } from 'react-helmet';

import { Footer, GlobalSearch } from 'ui';

import { Page } from '../ot-ui-components';

import Search from '../components/Search';
import NavBar from '../components/NavBar/NavBar';
import { externalLinks, mainMenuItems } from '../constants';

import SEARCH_QUERY from '../components/Search/SearchQuery.gql';

const BasePage = ({ children }) => (
  <Page
    header={
      <NavBar
        name="Genetics"
        items={mainMenuItems}
        search={<GlobalSearch searchQuery={SEARCH_QUERY} />}
      />
    }
    footer={<Footer externalLinks={externalLinks} />}
  >
    <Helmet
      defaultTitle="Open Targets Genetics"
      titleTemplate="%s | Open Targets Genetics"
    />
    {children}
  </Page>
);

export default BasePage;
