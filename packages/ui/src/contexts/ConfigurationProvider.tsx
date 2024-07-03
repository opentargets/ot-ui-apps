import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { gql, useQuery, ApolloError, NormalizedCacheObject, ApolloClient } from "@apollo/client";

// QUERY
const DATA_VERSION_QUERY = gql`
  query DataVersion {
    meta {
      dataVersion {
        month
        year
      }
    }
  }
`;

type Version = {
  month: string;
  year: string;
  loading: boolean;
  error: ApolloError | null;
};

type ContextType = {
  version: Version;
  client: ApolloClient<NormalizedCacheObject> | null;
};

interface ProviderProps extends PropsWithChildren {
  client: ApolloClient<NormalizedCacheObject>;
}

const initialState: ContextType = {
  version: {
    loading: false,
    error: null,
    month: "0",
    year: "0",
  },
  client: null,
};
export const ConfigurationContext = createContext<ContextType | undefined>(undefined);

export const ConfigurationProvider = ({ children, client }: ProviderProps): JSX.Element => {
  const [version, setVersion] = useState<ContextType["version"]>(initialState.version);

  const { data, loading, error } = useQuery(DATA_VERSION_QUERY);

  useEffect(() => {
    if (loading) {
      setVersion(v => ({ ...v, loading }));
      return;
    }

    if (error) {
      setVersion(v => ({ ...v, error }));
      return;
    }
    const {
      meta: {
        dataVersion: { month, year },
      },
    } = data;

    setVersion({
      loading: false,
      error: null,
      month: month,
      year: year,
    });
  }, [data, loading, error]);

  return (
    <ConfigurationContext.Provider value={{ version, client }}>
      {children}
    </ConfigurationContext.Provider>
  );
};

export const useConfigContext = (): ContextType => {
  const context = useContext(ConfigurationContext);

  if (!context) {
    throw new Error("useConfigContext must be used inside the ConfigurationProvider");
  }

  return context;
};
