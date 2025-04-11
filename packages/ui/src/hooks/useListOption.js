import { useNavigate } from "react-router-dom";
import {
  addSearchToLocalStorage,
  getSelectedEntityFilter,
  TOTAL_ENTITIES,
} from "../components/GlobalSearch/utils/searchUtils";

function useListOption() {
  const navigate = useNavigate();

  const entitiesWitAssociations = ["disease", "target"];

  const openListItem = (option, filterState) => {
    if (!option) return;

    const activeSearchEntities = getSelectedEntityFilter(filterState);

    const newOption = { ...option };
    newOption.type = "recent";
    addSearchToLocalStorage(newOption);

    if (newOption.entity === "search") {
      navigateToSearchResultsPage({ navigate, newOption, activeSearchEntities });
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

function navigateToSearchResultsPage({ navigate, newOption, activeSearchEntities = [] }) {
  if (activeSearchEntities.length === TOTAL_ENTITIES || activeSearchEntities.length === 0)
    navigate(`/search?q=${newOption.name}&page=1`);
  else navigate(`/search?q=${newOption.name}&page=1&entities=${activeSearchEntities.join()}`);
}

export default useListOption;
