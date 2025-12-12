import { faChartPie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ListItemIcon, ListItemText, MenuItem, styled } from "@mui/material";
import {
  setAssociationsState,
  setModalOpen,
  useGeneEnrichment,
} from "../../GeneEnrichmentAnalysis";
import useAotfContext from "../hooks/useAotfContext";

const StyledMenuItem = styled(MenuItem)({
  "&>.MuiListItemIcon-root>svg": {
    fontSize: "1rem",
  },
});

function GeneEnrichmentAnalysis() {
  const {
    id,
    searhFilter,
    sorting,
    enableIndirect,
    dataSourcesWeights,
    pinnedEntries,
    uploadedEntries,
    state,
  } = useAotfContext();

  const [, dispatch] = useGeneEnrichment();

  const handleClick = () => {
    dispatch(setModalOpen(true));
    dispatch(
      setAssociationsState({
        efoId: id,
        filter: searhFilter,
        sortBy: sorting[0].id,
        enableIndirect,
        pinnedEntities: pinnedEntries,
        uploadedEntities: uploadedEntries,
        datasources: dataSourcesWeights.map((el: any) => ({
          id: el.id,
          weight: el.weight,
          propagate: el.propagate,
          required: el.required,
        })),
        rowsFilter: pinnedEntries.toSorted(),
        facetFilters: state.facetFiltersIds,
        entitySearch: state.entitySearch,
      })
    );
  };

  return (
    <StyledMenuItem onClick={handleClick}>
      <ListItemIcon>
        <FontAwesomeIcon icon={faChartPie} />
      </ListItemIcon>
      <ListItemText>Gene enrichment</ListItemText>
    </StyledMenuItem>
  );
}
export default GeneEnrichmentAnalysis;
