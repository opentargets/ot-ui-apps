import { useState, useRef, useCallback, useEffect } from "react";
import {
  styled,
  Typography,
  Menu,
  MenuList,
  MenuItem,
  ListItemText,
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
// import Tooltip from "./AssocTooltip";

import useAotfContext from "../hooks/useAotfContext";
import { v1 } from "uuid";

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
  const name = cell.getValue();
  const { loading, prefix: tablePrefix } = cell.table.getState();
  const row = cell.row;
  const score = cell.score;
  const rowData = row.original;

  const [openContext, setOpenContext] = useState(false);
  const contextMenuRef = useRef();
  const {
    // entityToGet,
    // pinnedEntries,
    // setPinnedEntries,
    // handleActiveRow,
    expanderHandler,
    // resetExpandler,
  } = useAotfContext();

  // const isPinned = pinnedEntries.find(e => e === rowData.id);
  // const icon = rowEntity === "target" ? faDna : faStethoscope;
  // const rowEntity = entityToGet === "target" ? "target" : "disease";

  const pinnedIcon = tablePrefix === "body" ? faEllipsisVertical : faXmark;

  // const handleClickPin = () => {
  //   if (isPinned) {
  //     const newPinnedData = pinnedEntries.filter(e => e !== rowData.id);
  //     setPinnedEntries(newPinnedData);
  //   } else {
  //     setPinnedEntries([...pinnedEntries, rowData.id]);
  //   }
  // };

  // const handleClick = () => {
  //   setOpenContext(true);
  //   setAnchorEl(contextMenuRef.current);
  // };

  // const handleClose = useCallback(() => {
  //   setOpenContext(false);
  //   setAnchorEl(null);
  // }, [setOpenContext, setAnchorEl]);

  const handleClose = () => {
    // resetExpandler();
    // setAnchorEl(null);
    setOpenContext(false);
    console.log("close call", name);
  };

  useEffect(() => {
    // console.log({});
    if (openContext) console.log({ openContext });
    if (openContext) {
      console.log("effect", name);
      console.log({ contextMenuRef });
      // const event = expanderHandler(row.getToggleExpandedHandler());
      // event(cell, tablePrefix);
    }
  }, [openContext]);

  // const handleToggle = useCallback(() => {
  //   setOpenContext(true);
  //   // setAnchorEl(contextMenuRef.current);
  //   // const event = expanderHandler(row.getToggleExpandedHandler());
  //   // event(cell, tablePrefix);
  // }, [expanderHandler, row, tablePrefix, cell]);

  const handleToggle = () => {
    // resetExpandler();
    // setAnchorEl(null);
    setOpenContext(true);
    console.log("open call", name);
  };

  // const openContext = Boolean(anchorEl);

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
            <ListItemText>{name}</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem>
            <ListItemText>Double</ListItemText>
          </MenuItem>
        </MenuList>
        {/* <TooltipContent name={name} entity={rowEntity} id={rowId} icon={icon} /> */}
      </Popover>
    </NameContainer>
  );
}

export default CellName;
