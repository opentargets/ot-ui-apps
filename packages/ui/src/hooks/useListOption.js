import { useHistory } from "react-router-dom";
import { addSearchToLocalStorage } from "../components/GlobalSearch/utils/searchUtils";

function useListOption() {
  const history = useHistory();

  return option => {
    if (!option) return;
    const newOption = { ...option };
    newOption.type = "recent";
    addSearchToLocalStorage(newOption);

    if (newOption.entity === "search") {
      history.push(`/search?q=${newOption.name}&page=1`);
    } else if (newOption.entity === "study") {
      if (newOption.studyId) {
        history.push(`/${newOption.entity}/${newOption.studyId}`);
      } else {
        history.push(`/${newOption.entity}/${newOption.id}`);
      }
    } else if (["gene", "variant"].includes(newOption.entity)) {
      history.push(`/${newOption.entity}/${newOption.id}`);
    } else {
      history.push(
        `/${newOption.entity}/${newOption.id}${newOption.entity !== "drug" ? "/associations" : ""}`
      );
    }
  };
}

export default useListOption;
