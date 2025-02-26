import { useMemo, createContext } from "react";
import { useQuery } from "@apollo/client";

// import productionClient from "../client";

const PlatformApiContext = createContext();

function PlatformApiProvider({ entity, lsSectionsField, query, variables, children }) {
  const request = useQuery(query, { variables });

  const platformApiValue = useMemo(
    () => ({ ...request, entity, lsSectionsField }),
    [{ ...request, entity, lsSectionsField }]
  );

  return (
    <PlatformApiContext.Provider value={platformApiValue}>{children}</PlatformApiContext.Provider>
  );
}

export default PlatformApiProvider;
export { PlatformApiContext };
