// import { HttpLink } from "@apollo/client";
// import {
//   NextSSRInMemoryCache,
//   NextSSRApolloClient,
// } from "@apollo/experimental-nextjs-app-support/ssr";
// import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";

// export const { getClient } = registerApolloClient(() => {
//   return new NextSSRApolloClient({
//     cache: new NextSSRInMemoryCache(),
//     link: new HttpLink({
//       uri: "hhttps://api.platform.dev.opentargets.xyz/api/v4/graphql",
//     }),
//   });
// });

import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "https://api.platform.dev.opentargets.xyz/api/v4/graphql",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
