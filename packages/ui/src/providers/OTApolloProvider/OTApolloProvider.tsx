import { ApolloProvider, ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { createContext, useContext } from "react";
import { Config } from "@ot/config";
import { createApolloClient } from "./apollo";

const ApolloClientContext = createContext<ApolloClient<NormalizedCacheObject> | undefined>(
  undefined
);

export const useApolloClient = (): ApolloClient<NormalizedCacheObject> => {
  const client = useContext(ApolloClientContext);

  if (!client) {
    throw new Error("useApolloClient must be used within an OTApolloProvider");
  }

  return client;
};

export const OTApolloProvider = ({
  config,
  children,
}: {
  config: Config;
  children: React.ReactNode;
}) => {
  const client = createApolloClient(config);

  return (
    <ApolloClientContext.Provider value={client}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </ApolloClientContext.Provider>
  );
};
