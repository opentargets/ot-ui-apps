import { useState, useRef, useCallback, useEffect } from "react";
// import { Link as RouterLink } from "react-router-dom";
import {
  styled,
  Typography,
  MenuList,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Popover,
} from "@mui/material";
import {
  faDna,
  faStethoscope,
  faThumbTack,
  faXmark,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "ui";
import { ENTITIES } from "../utils";
// import Tooltip from "./AssocTooltip";

import useAotfContext from "../hooks/useAotfContext";
import { v1 } from "uuid";

const LinkAA = styled(Link)({
  color: "inherit",
  display: "flex",
});

const rowIcon = {
  [ENTITIES.DISEASE]: faStethoscope,
  [ENTITIES.TARGET]: faDna,
};

const NameContainer = styled("div")({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginLeft: 5,
  "&:hover": {
    cursor: "pointer",
  },
  "&:hover > .PinnedContainer": {
    opacity: 1,
  },
});

const TextContainer = styled("div")({
  display: "block",
  overflow: "hidden",
  textAlign: "end",
  textOverflow: "ellipsis",
  "&:hover span": {
    textDecoration: "underline",
  },
});

const LinksTooltipContent = styled("span")({
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  padding: "5px 10px",
});

const PinnedContainer = styled("div", {
  shouldForwardProp: prop => prop !== "active",
})(({ active }) => ({
  opacity: active ? "1" : "0",
  cursor: "pointer",
  // padding: "1px 3px",
  borderRadius: "15%",
  // backgroundColor: active ? "#f6f6f6" : "inherit",
  // backgroundColor: "#f6f6f6",
  "&:hover": {
    backgroundColor: "#f6f6f6",
  },
}));

function TooltipContent({ id, entity, name, icon }) {
  const profileURL = `/${entity}/${id}`;
  const associationsURL = `/${entity}/${id}/associations`;
  return (
    <LinksTooltipContent>
      <Typography variant="h6">{name}</Typography>
      <Typography>
        <Link to={profileURL}>Go to Profile</Link>
      </Typography>
      <Typography>
        <Link to={associationsURL}>Go to Associations</Link>
      </Typography>
    </LinksTooltipContent>
  );
}

function CellName({ cell }) {
  const { loading, prefix: tablePrefix } = cell.table.getState();
  const name = cell.getValue();
  const row = cell.row;
  const { id } = row;
  const { score } = row.original;

  const [openContext, setOpenContext] = useState(false);
  const contextMenuRef = useRef();
  const { expanderHandler, entityToGet } = useAotfContext();

  const profileURL = `/${entityToGet}/${id}`;

  const pinnedIcon = tablePrefix === "body" ? faEllipsisVertical : faXmark;

  const handleClose = () => {
    setOpenContext(false);
  };

  useEffect(() => {
    if (openContext) {
      // const event = expanderHandler(row.getToggleExpandedHandler());
      // event(cell, tablePrefix);
    }
  }, [openContext]);

  const handleToggle = () => {
    setOpenContext(true);
  };

  if (loading) return null;

  return (
    <NameContainer>
      <TextContainer onClick={handleToggle}>
        <Typography width="150px" noWrap variant="body2">
          {name}
        </Typography>
      </TextContainer>
      <PinnedContainer
        ref={contextMenuRef}
        className="PinnedContainer"
        onClick={handleToggle}
        active={openContext}
      >
        <FontAwesomeIcon icon={pinnedIcon} size="lg" />
      </PinnedContainer>
      <Popover
        id="context-menu"
        open={openContext}
        anchorEl={contextMenuRef.current}
        onClose={handleClose}
        disableScrollLock
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuList dense>
          <MenuItem>
            {/* <LinkAA to={profileURL}> */}
            <ListItemIcon>
              <FontAwesomeIcon size="sm" icon={rowIcon[entityToGet]} />
            </ListItemIcon>
            <ListItemText>{name}</ListItemText>
            {/* </LinkAA> */}
          </MenuItem>
          <Divider />
          <MenuItem>{name}</MenuItem>
        </MenuList>
        {/* <TooltipContent name={name} entity={rowEntity} id={rowId} icon={icon} /> */}
      </Popover>
    </NameContainer>
  );
}

export default CellName;
