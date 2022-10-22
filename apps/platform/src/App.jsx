import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';

import { ThemeProvider } from 'ui';
import client from './client';
// import initLocalStorage from './utils/initLocalStorage';
import theme from './theme';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import DiseasePage from './pages/NewDiseasePage';
import DownloadsPage from './pages/DownloadsPage';
import DrugPage from './pages/DrugPage';
import TargetPage from './pages/NewTargetPage';
import EvidencePage from './pages/EvidencePage';
import VariantsPage from './pages/VariantsPage';
import APIPage from './pages/APIPage';
import NotFoundPage from './pages/NotFoundPage';

class App extends Component {
  componentDidMount() {
    // initLocalStorage();
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <Router>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/search" component={SearchPage} />
              <Route path="/downloads" component={DownloadsPage} />
              <Route path="/disease/:efoId" component={DiseasePage} />
              <Route path="/target/:ensgId" component={TargetPage} />
              <Route path="/drug/:chemblId" component={DrugPage} />
              <Route path="/evidence/:ensgId/:efoId" component={EvidencePage} />
              <Route path="/variants" component={VariantsPage} />
              <Route path="/api" component={APIPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </Router>
        </ThemeProvider>
      </ApolloProvider>
    );
  }
}

export default App;
