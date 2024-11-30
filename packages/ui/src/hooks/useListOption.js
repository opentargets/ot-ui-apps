import { useNavigate } from "react-router-dom";
import { addSearchToLocalStorage } from "../components/GlobalSearch/utils/searchUtils";

function useListOption() {
  const navigate = useNavigate();

  const openListItem = option => {
    if (!option) return;
    const newOption = { ...option };
    newOption.type = "recent";
    addSearchToLocalStorage(newOption);

    if (newOption.entity === "search") {
      navigate(`/search?q=${newOption.name}&page=1`);
    } else if (newOption.entity === "study") {
      navigate(`/${newOption.entity}/${newOption.studyId}`);
    } else {
      navigate(
        `/${newOption.entity}/${newOption.id}${
          newOption.entity !== "drug" && newOption.entity !== "variant" ? "/associations" : ""
        }`
      );
    }
  };

  return [openListItem];
}

export default useListOption;
