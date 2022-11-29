import { useHistory } from "react-router-dom";
import { addSearchToLocalStorage } from "../utils/searchUtil";

function useListOption() {
  let history = useHistory();

  const openListItem = (option) => {
    addSearchToLocalStorage(option);

    if (!option) return;

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
