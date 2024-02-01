import { useHistory } from "react-router-dom";
import { addSearchToLocalStorage } from "../components/GlobalSearch/utils/searchUtils";

function useListOption() {
  const history = useHistory();

  const openListItem = option => {
    if (!option) return;
    const newOption = { ...option };
    newOption.type = "recent";
    addSearchToLocalStorage(newOption);

    if (newOption.entity === "search") {
      history.push(`/search?q=${newOption.name}&page=1`);
    } else if (newOption.entity === "study") {
      history.push(`/${newOption.entity}/${newOption.studyId}`);
    } else {
      history.push(
        `/${newOption.entity}/${newOption.id}${newOption.entity !== "drug" ? "/associations" : ""}`
      );
    }
  };

  return [openListItem];
}

export default useListOption;
