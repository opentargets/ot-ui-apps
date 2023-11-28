import React, { useState } from "react";
import { List, Collapse, ListItem, ListItemText, ListItemButton } from "@mui/material";
import { v1 } from "uuid";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NestedItem = ({ children, hits = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleIsOpen = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <List>
      {hits.length > 0 && (
        <ListItemButton onClick={handleIsOpen}>
          <ListItemText primary={children} />
          {isOpen ? (
            <FontAwesomeIcon icon={faChevronUp} />
          ) : (
            <FontAwesomeIcon icon={faChevronDown} />
          )}
        </ListItemButton>
      )}
      {hits.length === 0 && (
        <ListItem>
          <ListItemText primary={children} />
        </ListItem>
      )}
      {hits.length > 0 && (
        <Collapse in={isOpen}>
          <List>
            {hits.map(hit => (
              <ListItem sx={{ pl: 4 }} key={v1()}>
                <ListItemText primary={`${hit.id} - ${hit.name}`} />
              </ListItem>
            ))}
          </List>
        </Collapse>
      )}
    </List>
  );
};

export default NestedItem;
