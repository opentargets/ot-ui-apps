import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AppCacheProvider } from "@mui/material-nextjs/v13-pagesRouter";
import { SearchProvider, PrivateRoute, ConfigurationProvider } from "ui";
import { ThemeProvider } from "@mui/material/styles";
import { ApolloWrapper } from "@/lib/apollo-provider";

import SEARCH_QUERY from "../components/Search/SearchQuery.gql";
import { getSuggestedSearch } from "../utils/global";

import theme from "../styles/theme";
import client from "@/lib/client";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const suggestions = getSuggestedSearch();
  return (
    <ApolloWrapper>
      <AppCacheProvider {...props}>
        <ConfigurationProvider client={client}>
          <ThemeProvider theme={theme}>
            <SearchProvider
              searchSuggestions={suggestions}
              searchQuery={SEARCH_QUERY}
              searchPlaceholder="Search for a target, drug, disease, or phenotype..."
            >
              <Component {...pageProps} />;
            </SearchProvider>
          </ThemeProvider>
        </ConfigurationProvider>
      </AppCacheProvider>
    </ApolloWrapper>
  );
}
