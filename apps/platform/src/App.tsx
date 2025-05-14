import { getConfig } from "@ot/config";
import type { ReactElement } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { OTConfigurationProvider, PrivateRoute, SearchProvider } from "ui";

import SEARCH_QUERY from "./components/Search/SearchQuery.gql";

import APIPage from "./pages/APIPage";
import CredibleSetPage from "./pages/CredibleSetPage";
import DiseasePage from "./pages/DiseasePage/DiseasePage";
import DownloadsPage from "./pages/DownloadsPage";
import DrugPage from "./pages/DrugPage";
import EvidencePage from "./pages/EvidencePage";
import HomePage from "./pages/HomePage/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ProjectsPage from "./pages/ProjectsPage";
import SearchPage from "./pages/SearchPage";
import StudyPage from "./pages/StudyPage";
import TargetPage from "./pages/TargetPage";
import VariantPage from "./pages/VariantPage";

const config = getConfig();

function App(): ReactElement {
  return (
    <OTConfigurationProvider config={config}>
      <SearchProvider
        searchQuery={SEARCH_QUERY}
        searchPlaceholder="Search for a target, drug, disease, or phenotype..."
      >
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/api" element={<APIPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/downloads" element={<DownloadsPage />} />
            <Route path="/target/:ensgId/*" element={<TargetPage />} />
            <Route path="/disease/:efoId/*" element={<DiseasePage />} />
            <Route path="/evidence/:ensgId/:efoId/*" element={<EvidencePage />} />
            <Route path="/drug/:chemblId/*" element={<DrugPage />} />
            <Route path="/variant/:varId/*" element={<VariantPage />} />
            <Route path="/study/:studyId/*" element={<StudyPage />} />
            <Route path="/credible-set/:studyLocusId/*" element={<CredibleSetPage />} />
            <Route
              path="/projects"
              element={
                <PrivateRoute>
                  <ProjectsPage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </SearchProvider>
    </OTConfigurationProvider>
  );
}

export default App;
