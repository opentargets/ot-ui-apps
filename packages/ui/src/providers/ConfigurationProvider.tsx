import { PropsWithChildren, createContext, useContext } from "react";
import { Config, theme } from "@ot/config";
import { OTApolloProvider } from "./OTApolloProvider/OTApolloProvider";
import ThemeProvider from "./ThemeProvider/ThemeProvider";
import { APIMetadataProvider } from "./APIMetadataProvider";

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
      <OTApolloProvider config={config}>
        <ThemeProvider theme={theme}>
          <APIMetadataProvider>{children}</APIMetadataProvider>
        </ThemeProvider>
      </OTApolloProvider>
    </OTConfigurationContext.Provider>
  );
};

export const useConfigContext = (): ContextType => {
  const context = useContext(OTConfigurationContext);

  if (!context) {
    throw new Error("useConfigContext must be used inside the ConfigurationProvider");
  }

  return context;
};
