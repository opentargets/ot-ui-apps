import { ApolloClient, InMemoryCache } from "@apollo/client";
import config from "./config";

const client = new ApolloClient({
  uri: config.urlApi,
  cache: new InMemoryCache({
    typePolicies: {
      ScoredComponent: {
        keyFields: ["componentId", "score"],
      },
      Indications: {
        keyFields: [],
      },
      MechanismsOfAction: {
        keyFields: [],
      },
      Hallmarks: {
        keyFields: [],
      },
    },
  }),
  headers: { "OT-Platform": true },
});

export default client;
