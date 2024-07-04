import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { ThemeProvider, SearchProvider, PrivateRoute, ConfigurationProvider } from "ui";

import SEARCH_QUERY from "./components/Search/SearchQuery.gql";
import ShouldAccessPPP from "./components/ShouldAccessPPP";
import client from "./client";
import theme from "./theme";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import DiseasePage from "./pages/DiseasePage/DiseasePage";
import DownloadsPage from "./pages/DownloadsPage";
import DrugPage from "./pages/DrugPage";
import TargetPage from "./pages/TargetPage";
import EvidencePage from "./pages/EvidencePage";
import VariantPage from "./pages/VariantPage";
import APIPage from "./pages/APIPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProjectsPage from "./pages/ProjectsPage";
import { getSuggestedSearch } from "./utils/global";
import { ReactElement } from "react";

function App(): ReactElement {
  const suggestions = getSuggestedSearch();
  return (
    <ApolloProvider client={client}>
      <ConfigurationProvider client={client}>
        <ThemeProvider theme={theme}>
          <SearchProvider
            searchSuggestions={suggestions}
            searchQuery={SEARCH_QUERY}
            searchPlaceholder="Search for a target, drug, disease, or phenotype..."
          >
            <Router>
              <Switch>
                <Route exact path="/">
                  <HomePage suggestions={suggestions} />
                </Route>
                <Route path="/search">
                  <SearchPage />
                </Route>
                <Route path="/downloads">
                  <DownloadsPage />
                </Route>
                <Route path="/disease/:efoId">
                  <DiseasePage />
                </Route>
                <Route path="/target/:ensgId">
                  <TargetPage />
                </Route>
                <Route path="/drug/:chemblId">
                  <DrugPage />
                </Route>
                <Route path="/evidence/:ensgId/:efoId">
                  <EvidencePage />
                </Route>
                <Route path="/variant/:varId">
                  <VariantPage />
                </Route>
                <Route path="/api">
                  <APIPage />
                </Route>
                <Route path="/projects">
                  <PrivateRoute>
                    <ProjectsPage />
                  </PrivateRoute>
                </Route>
                <Route>
                  <NotFoundPage />
                </Route>
              </Switch>
              <ShouldAccessPPP />
            </Router>
          </SearchProvider>
        </ThemeProvider>
      </ConfigurationProvider>
    </ApolloProvider>
  );
}

export default App;
