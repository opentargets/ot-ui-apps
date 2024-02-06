import { useState } from "react";
import { styled, Typography, Popover } from "@mui/material";
import {
  faDna,
  faStethoscope,
  faThumbTack,
  faXmark,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "ui";
import Tooltip from "./AssocTooltip";

import useAotfContext from "../hooks/useAotfContext";

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
      <Typography variant="h6">
        <FontAwesomeIcon icon={icon} /> {name}
      </Typography>
      <Typography>
        <Link to={profileURL}>Go to Profile</Link>
      </Typography>
      <Typography>
        <Link to={associationsURL}>Go to Associations</Link>
      </Typography>
    </LinksTooltipContent>
  );
}

function CellName({ name, rowId, row, tablePrefix }) {
  // const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { entityToGet, pinnedEntries, setPinnedEntries } = useAotfContext();

  const rowData = row.original;

  const isPinned = pinnedEntries.find(e => e === rowData.id);
  const rowEntity = entityToGet === "target" ? "target" : "disease";
  const icon = rowEntity === "target" ? faDna : faStethoscope;

  const pinnedIcon = tablePrefix === "body" ? faEllipsisVertical : faXmark;

  const handleClickPin = () => {
    if (isPinned) {
      const newPinnedData = pinnedEntries.filter(e => e !== rowData.id);
      setPinnedEntries(newPinnedData);
    } else {
      setPinnedEntries([...pinnedEntries, rowData.id]);
    }
  };

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // const openContextBtn = () => {
  //   setOpen(true);
  // };

  return (
    <NameContainer
      onClick={() => {
        // openContextBtn();
      }}
      onMouseLeave={() => {
        // setOpen(false);
      }}
    >
      <TextContainer>
        <Typography width="160px" noWrap variant="body2">
          {name}
        </Typography>
      </TextContainer>
      <PinnedContainer className="PinnedContainer" onClick={handleClick} active={open}>
        <FontAwesomeIcon icon={pinnedIcon} size="lg" />
      </PinnedContainer>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        // onOpen={openContextBtn}
        onClose={handleClose}
        placement="right-start"
      >
        <TooltipContent name={name} entity={rowEntity} id={rowId} icon={icon} />
      </Popover>
    </NameContainer>
  );
}

export default CellName;
