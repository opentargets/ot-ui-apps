import { useMemo, createContext, ReactNode } from "react";
import { useQuery, DocumentNode, QueryResult } from "@apollo/client";

interface PlatformApiContextValue {
  entity: string;
  loading: boolean;
  error?: any;
  data?: any;
  refetch: () => Promise<any>;
  fetchMore: (options: any) => Promise<any>;
}

const PlatformApiContext = createContext<PlatformApiContextValue | undefined>(undefined);

interface PlatformApiProviderProps {
  entity: string;
  query: DocumentNode;
  variables?: Record<string, any>;
  children: ReactNode;
}

function PlatformApiProvider({
  entity,
  query,
  variables,
  children,
}: PlatformApiProviderProps) {
  const request: QueryResult = useQuery(query, { variables });

  const { loading, error, data, refetch, fetchMore } = request;

  const platformApiValue = useMemo(
    () => ({ 
      loading, 
      error, 
      data, 
      refetch, 
      fetchMore, 
      entity 
    }),
    [loading, error, data, refetch, fetchMore, entity]
  );

  return (
    <PlatformApiContext.Provider value={platformApiValue}>
      {children}
    </PlatformApiContext.Provider>
  );
}

export default PlatformApiProvider;
export { PlatformApiContext };
