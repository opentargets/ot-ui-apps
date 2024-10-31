import { createContext, useEffect, useMemo, useState, ReactElement } from "react";
import { getDefaultProfileFilters } from "../utils";
import { Definition, ProfileContextType, ProfileStateProviderProps } from "../types";
import { DataSource } from "../../AssociationsToolkit/types";

const ProfileStateContext = createContext<ProfileContextType | undefined>(undefined);

function ProfileStateProvider({ children, entity }: ProfileStateProviderProps): ReactElement {
  const [profileFilter, setProfileFilter] = useState<(Definition | DataSource)[]>(
    getDefaultProfileFilters(entity)
  );
  useEffect(() => {
    const retrieved = JSON.parse(window.localStorage.getItem("profileFilter" + entity) || "null");
    retrieved && setProfileFilter(retrieved);
  }, [entity]);

  useEffect(() => {
    window.localStorage.setItem("profileFilter" + entity, JSON.stringify(profileFilter));
  }, [profileFilter]);

  const contextVariables = useMemo(
    () => ({
      profileFilter,
      setProfileFilter,
      entity,
    }),
    [profileFilter]
  );
  return (
    <ProfileStateContext.Provider value={contextVariables}>{children}</ProfileStateContext.Provider>
  );
}

export { ProfileStateProvider, ProfileStateContext };
