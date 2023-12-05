import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Typography,
} from "@mui/material";
import { faChevronRight, faChevronDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { TreeView } from "@mui/x-tree-view";
import { makeStyles } from "@mui/styles";

import { hasAnyDescendantChecked } from "./utils";
import TreeLevel from "./TreeLevel";

const useStyles = makeStyles({
  accordionSummaryContent: {
    alignItems: "center",
    justifyContent: "space-between",
    margin: "0 !important",
  },
  clearButtonRoot: {
    height: "unset",
  },
  facetRoot: {
    width: "100%",
  },
});

function Facet({ loading, treeId, label, aggs, onSelectionChange }) {
  const classes = useStyles();

  const handleSelectionChange = newSelection => {
    onSelectionChange(newSelection);
  };

  const handleClickClear = event => {
    event.stopPropagation();
    onSelectionChange([treeId], false);
  };

  return (
    <Accordion>
      <AccordionSummary
        classes={{ content: classes.accordionSummaryContent }}
        expandIcon={<FontAwesomeIcon icon={faChevronDown} />}
      >
        <Typography>{label}</Typography>
        {hasAnyDescendantChecked(aggs) && (
          <IconButton
            className={classes.clearButtonRoot}
            disabled={loading}
            onClick={handleClickClear}
          >
            <FontAwesomeIcon icon={faXmark} />
          </IconButton>
        )}
      </AccordionSummary>

      <AccordionDetails>
        <TreeView
          className={classes.facetRoot}
          defaultCollapseIcon={<FontAwesomeIcon icon={faChevronDown} />}
          defaultExpandIcon={<FontAwesomeIcon icon={faChevronRight} />}
        >
          <TreeLevel
            loading={loading}
            levelId={treeId}
            aggs={aggs}
            onSelectionChange={handleSelectionChange}
          />
        </TreeView>
      </AccordionDetails>
    </Accordion>
  );
}

export default Facet;
