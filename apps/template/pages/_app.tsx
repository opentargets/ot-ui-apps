import Head from "next/head";
import { AppProps } from "next/app";
import { AppCacheProvider } from "@mui/material-nextjs/v14-pagesRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ApolloWrapper } from "../src/lib/apollo-provider";
import theme from "../src/styles/theme";
import { SearchProvider, ConfigurationProvider } from "ui";

import client from "@lib/client";
import SEARCH_QUERY from "../src/components/Search/SearchQuery.gql";
console.log({ SEARCH_QUERY });

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;
  return (
    <AppCacheProvider {...props}>
      <ApolloWrapper>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </ApolloWrapper>
    </AppCacheProvider>
  );
}
