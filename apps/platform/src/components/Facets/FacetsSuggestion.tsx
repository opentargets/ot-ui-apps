import { ReactElement } from "react";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";
import { useAotfContext } from "../AssociationsToolkit";

const TARGET_EXAMPLE = "Measurement";
const DISEASE_EXAMPLE = "Enzyme";

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
          Please search by {entityToGet} or filter by {entityToGet} category. Example:{" "}
          {entity === "disease" ? DISEASE_EXAMPLE : TARGET_EXAMPLE}
        </Box>
      </Box>
    </Box>
  );
}
export default FacetsSuggestion;
