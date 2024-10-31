import { useContext } from "react";
import { ProfileContext } from "../index";

function useProfileContext() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfileContext must be used within a ProfileStateProvider");
  }
  return context;
}
export default useProfileContext;
