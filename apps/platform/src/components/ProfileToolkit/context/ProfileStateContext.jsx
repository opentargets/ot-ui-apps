import { createContext, useEffect, useMemo, useState } from "react";
import { getDefaultProfileFilters } from "../utils";

const ProfileStateContext = createContext();

function ProfileStateProvider({ children, entity }) {
  const [profileFilter, setProfileFilter] = useState(getDefaultProfileFilters(entity));
  useEffect(() => {
    const retrieved = JSON.parse(window.localStorage.getItem("profileFilter" + entity));
    retrieved && setProfileFilter(retrieved);
  }, []);

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
