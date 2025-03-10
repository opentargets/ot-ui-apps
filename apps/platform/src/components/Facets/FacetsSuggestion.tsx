import { ReactElement, useState } from "react";
import { Box, Collapse } from "@mui/material";
import { useAotfContext } from "../AssociationsToolkit";
import { ENTITY } from "./facetsTypes";
import { Link } from "ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";

const EXAMPLE = {
  [ENTITY.DISEASE]: "Eczema",
  [ENTITY.TARGET]: "Enzyme",
};

function FacetsSuggestion(): ReactElement {
  const { entityToGet } = useAotfContext();
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ typography: "caption" }}>
        <Box>
          <Box component="span" sx={{ cursor: "pointer" }} onClick={() => setOpen(!open)}>
            <b>
              How do facet filters work?{" "}
              {open ? <FontAwesomeIcon icon={faCaretUp} /> : <FontAwesomeIcon icon={faCaretDown} />}
            </b>
          </Box>
          <Collapse in={open}>
            <ul style={{ paddingLeft: "15px" }}>
              <li>
                Search by {entityToGet} or filter by {entityToGet} category. Example:{" "}
                {EXAMPLE[entityToGet]}
              </li>
              <li>
                Filters across categories use <b>AND</b>
              </li>
              <li>
                Filters within a category use <b>OR</b>
              </li>
            </ul>
            <Box sx={{ w: 1, display: "flex", justifyContent: "end" }}>
              <Link
                to="https://platform-docs.opentargets.org/web-interface/associations-on-the-fly#filtering-functionality"
                external
                footer={false}
                newTab
              >
                Read more details here
              </Link>
            </Box>
          </Collapse>
        </Box>
      </Box>
    </Box>
  );
}
export default FacetsSuggestion;
