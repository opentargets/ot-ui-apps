import { faChartPie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ListItemIcon, ListItemText, MenuItem, styled } from "@mui/material";
import {
  setAssociationsState,
  setModalOpen,
  useGeneEnrichment,
} from "../../GeneEnrichmentAnalysis";
import { useAotfQueryState } from "../context/AssociationsQueryContext";
import { useAotfURLState } from "../context/AssociationsURLContext";

const StyledMenuItem = styled(MenuItem)({
  "&>.MuiListItemIcon-root>svg": {
    fontSize: "1rem",
  },
});

function GeneEnrichmentAnalysis() {
  const {
    id,
    entitySearch,
    sorting,
    enableIndirect,
    dataSourceControls,
    facetFiltersIds,
  } = useAotfQueryState();
  const { pinnedEntries, uploadedEntries } = useAotfURLState();

  const [, dispatch] = useGeneEnrichment();

  const handleClick = () => {
    dispatch(setModalOpen(true));
    dispatch(
      setAssociationsState({
        efoId: id,
        filter: entitySearch,
        sortBy: sorting[0].id,
        enableIndirect,
        pinnedEntities: pinnedEntries,
        uploadedEntities: uploadedEntries,
        datasources: dataSourceControls.map((el: any) => ({
          id: el.id,
          weight: el.weight,
          propagate: el.propagate,
          required: el.required,
        })),
        rowsFilter: pinnedEntries.toSorted(),
        facetFilters: facetFiltersIds,
        entitySearch,
      })
    );
  };

  return (
    <StyledMenuItem onClick={handleClick}>
      <ListItemIcon>
        <FontAwesomeIcon icon={faChartPie} />
      </ListItemIcon>
      <ListItemText>Gene set enrichment analysis (GSEA)</ListItemText>
    </StyledMenuItem>
  );
}
export default GeneEnrichmentAnalysis;
