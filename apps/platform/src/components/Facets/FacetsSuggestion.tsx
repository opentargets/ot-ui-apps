import { ReactElement } from "react";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";
import { useAotfContext } from "../AssociationsToolkit";
import { ENTITY } from "./facetsTypes";
import { Link } from "ui";

const EXAMPLE = {
  [ENTITY.DISEASE]: "Eczema",
  [ENTITY.TARGET]: "Enzyme",
};

function FacetsSuggestion(): ReactElement {
  const { entityToGet } = useAotfContext();

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ typography: "caption" }}>
        <Box>
          <b>How do facet filters work?</b>
          <ul style={{ paddingLeft: "15px" }}>
            <li>
              Please search by {entityToGet} or filter by {entityToGet} category. Example:{" "}
              {EXAMPLE[entityToGet]}
            </li>
            <li>
              Filters across categories use <b>AND</b>
            </li>
            <li>
              Filters within a category use <b>OR</b>
            </li>
          </ul>
        </Box>
        <Box sx={{ w: 1, display: "flex", justifyContent: "end" }}>
          <Link
            to="https://platform-docs.opentargets.org/web-interface/associations-on-the-fly#filtering-functionality"
            external
            footer={false}
          >
            Read more details here.
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
export default FacetsSuggestion;
