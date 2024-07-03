import { useContext } from "react";
import AssociationsContext from "../context/AssociationsStateContext";

function useAotfContext() {
  return useContext(AssociationsContext);
}
export default useAotfContext;
