import { useNavigate } from "react-router-dom";
import { addSearchToLocalStorage } from "../components/GlobalSearch/utils/searchUtils";

function useListOption() {
  const navigate = useNavigate();

  const entitiesWitAssociations = ["disease", "target"];

  const openListItem = option => {
    if (!option) return;
    const newOption = { ...option };
    newOption.type = "recent";
    addSearchToLocalStorage(newOption);

    if (newOption.entity === "search") {
      navigate(`/search?q=${newOption.name}&page=1`);
    } else {
      navigate(
        `/${newOption.entity}/${newOption.id}${
          entitiesWitAssociations.indexOf(newOption.entity) > -1 ? "/associations" : ""
        }`
      );
    }
  };

  return [openListItem];
}

export default useListOption;
