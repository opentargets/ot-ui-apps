import { useMemo, createContext, ReactNode } from "react";
import { useQuery, DocumentNode, QueryResult } from "@apollo/client";

interface PlatformApiContextValue {
  entity: string;
  lsSectionsField: string;
  loading: boolean;
  error?: any;
  data?: any;
  refetch: () => Promise<any>;
  fetchMore: (options: any) => Promise<any>;
}

const PlatformApiContext = createContext<PlatformApiContextValue | undefined>(undefined);

interface PlatformApiProviderProps {
  entity: string;
  lsSectionsField: string;
  query: DocumentNode;
  variables?: Record<string, any>;
  children: ReactNode;
}

function PlatformApiProvider({
  entity,
  lsSectionsField,
  query,
  variables,
  children,
}: PlatformApiProviderProps) {
  const request: QueryResult = useQuery(query, { variables });

  const platformApiValue = useMemo(
    () => ({ ...request, entity, lsSectionsField }),
    [request, entity, lsSectionsField]
  );

  return (
    <PlatformApiContext.Provider value={platformApiValue}>{children}</PlatformApiContext.Provider>
  );
}

export default PlatformApiProvider;
export { PlatformApiContext };
