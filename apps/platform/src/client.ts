import { ApolloClient, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import possibleTypes from "./possibleTypes.json";
import config from "./config";

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  uri: config.urlApi,
  cache: new InMemoryCache({
    possibleTypes,
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
