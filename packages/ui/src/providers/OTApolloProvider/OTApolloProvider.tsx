import { ApolloProvider } from "@apollo/client";
import { Config } from "@ot/config";
import { createApolloClient } from "./apollo";

export const OTApolloProvider = ({
  config,
  children,
}: {
  config: Config;
  children: React.ReactNode;
}) => {
  const client = createApolloClient(config);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
