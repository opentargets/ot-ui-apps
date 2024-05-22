import { ReactElement } from "react";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";
import { useAotfContext } from "../AssociationsToolkit";

function FacetsSuggestion(): ReactElement {
  const { entityToGet, entity } = useAotfContext();

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box>
        <Box
          sx={{
            display: "flex",
            typography: "subtitle1",
            fontWeight: "bold",
            alignItems: "center",
            gap: theme => theme.spacing(1),
          }}
        >
          <FontAwesomeIcon icon={faLightbulb} />
          Tip:
        </Box>
        <Box sx={{ typography: "body2" }}>
          Please filter {entityToGet}s by aggregated {entity} types or search for single {entity}.
          Example: Enzyme
        </Box>
      </Box>
    </Box>
  );
}
export default FacetsSuggestion;
