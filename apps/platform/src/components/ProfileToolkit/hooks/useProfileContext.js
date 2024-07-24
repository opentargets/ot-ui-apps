import { useContext } from "react";
import { ProfileContext } from "../index";

function useProfileContext() {
  return useContext(ProfileContext);
}
export default useProfileContext;
