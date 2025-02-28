import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, from } from "@apollo/client";
import { Config } from "@ot/config";

export const createApolloClient = (config: Config) => {
  const httpLink = new HttpLink({
    uri: config.urlApi,
  });

  const errorLink = new ApolloLink((operation, forward) => {
    return forward(operation).map(response => {
      if (response.errors) {
        response.errors.forEach(error => {
          console.error(`GraphQL Error: ${error.message}`);
        });
      }
      return response;
    });
  });

  return new ApolloClient({
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache({
      possibleTypes: {
        EntityUnionType: ["Target", "Drug", "Disease", "Variant", "Gwas"],
      },
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
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
      },
    },
  });
};
