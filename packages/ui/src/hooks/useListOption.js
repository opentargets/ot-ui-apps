import { useHistory } from "react-router-dom";
import { addSearchToLocalStorage } from "../utils/searchUtils";

function useListOption() {
  let history = useHistory();

  const openListItem = (option) => {
    
    if (!option) return;
    addSearchToLocalStorage(option);

    if (option.entity === "study") {
      history.push(`/${option.entity}/${option.studyId}`);
    } else {
      history.push(
        `/${option.entity}/${option.id}${
          option.entity !== "drug" ? "/associations" : ""
        }`
      );
    }
  };

  return [openListItem];
}

export default useListOption;
