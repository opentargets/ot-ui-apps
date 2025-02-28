import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { gql, useQuery, ApolloError } from "@apollo/client";

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
};

const initialState: ContextType = {
  version: {
    loading: false,
    error: null,
    month: "0",
    year: "0",
  },
};
export const APIMetadataContext = createContext<ContextType | undefined>(undefined);

export const APIMetadataProvider = ({ children }: PropsWithChildren): JSX.Element => {
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

  return <APIMetadataContext.Provider value={{ version }}>{children}</APIMetadataContext.Provider>;
};

export const useAPIMetadata = (): ContextType => {
  const context = useContext(APIMetadataContext);

  if (!context) {
    throw new Error("useAPIMetadata must be used inside the APIMetadataProvider");
  }

  return context;
};
