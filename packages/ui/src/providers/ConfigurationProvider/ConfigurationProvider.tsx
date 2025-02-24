import { PropsWithChildren, createContext, useContext } from "react";
import { getConfig, Config } from "@ot/config";

const config = getConfig();

type ContextType = {
  config: Config;
};

interface ProviderProps extends PropsWithChildren {
  // config: Config;
  // client: ApolloClient<NormalizedCacheObject>;
}

const initialState: { config: Config } = { config };

export const ConfigurationContext = createContext<ContextType>(initialState);

export const ConfigurationProvider = ({ children }: ProviderProps): JSX.Element => {
  return (
    <ConfigurationContext.Provider value={{ config }}>{children}</ConfigurationContext.Provider>
  );
};

export const useConfigContext = (): ContextType => {
  const context = useContext(ConfigurationContext);

  if (!context) {
    throw new Error("useConfigContext must be used inside the ConfigurationProvider");
  }

  return context;
};
