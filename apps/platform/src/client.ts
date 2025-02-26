import { ApolloClient, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { getConfig } from "@ot/config";

const config = getConfig();

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
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
      AlleleFrequency: {
        keyFields: ["populationName"],
      },
      InSilicoPredictor: {
        keyFields: ["method"],
      },
    },
  }),
  headers: { "OT-Platform": "true" },
});

export default client;
