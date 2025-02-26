import { PropsWithChildren, createContext, useContext } from "react";
import { Config } from "@ot/config";
import { OTApolloProvider } from "./OTApolloProvider/OTApolloProvider";

type ContextType = {
  config: Config | null;
};
interface ProviderProps extends PropsWithChildren {
  config: Config | null;
}

export const OTConfigurationContext = createContext<ContextType>({ config: null });

export const OTConfigurationProvider = ({ children, config }: ProviderProps): JSX.Element => {
  if (!config) {
    throw new Error("ConfigurationProvider requires a Config object");
  }
  return (
    <OTConfigurationContext.Provider value={{ config }}>
      <OTApolloProvider config={config}>{children}</OTApolloProvider>
    </OTConfigurationContext.Provider>
  );
};

export const OTuseConfigContext = (): ContextType => {
  const context = useContext(OTConfigurationContext);

  if (!context) {
    throw new Error("useConfigContext must be used inside the ConfigurationProvider");
  }

  return context;
};
