import { useState } from "react";
import { styled, Typography } from "@mui/material";
import { faDna, faStethoscope, faThumbTack, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "ui";
import Tooltip from "./AssocTooltip";

import useAotfContext from "../hooks/useAotfContext";

const NameContainer = styled("div")({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
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
  maxWidth: "120px",
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
  marginLeft: "5px",
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
  const [open, setOpen] = useState(false);
  const { entityToGet, pinnedEntries, setPinnedEntries } = useAotfContext();

  const rowData = row.original;

  const isPinned = pinnedEntries.find(e => e === rowData.id);
  const rowEntity = entityToGet === "target" ? "target" : "disease";
  const icon = rowEntity === "target" ? faDna : faStethoscope;

  const pinnedIcon = tablePrefix === "body" ? faThumbTack : faXmark;

  const handleClickPin = () => {
    if (isPinned) {
      const newPinnedData = pinnedEntries.filter(e => e !== rowData.id);
      setPinnedEntries(newPinnedData);
    } else {
      setPinnedEntries([...pinnedEntries, rowData.id]);
    }
  };

  return (
    <Tooltip
      open={open}
      onClose={() => setOpen(false)}
      placement="top"
      arrow
      title={<TooltipContent name={name} entity={rowEntity} id={rowId} icon={icon} />}
    >
      <NameContainer
        onClick={() => {
          setOpen(true);
        }}
      >
        <PinnedContainer className="PinnedContainer" onClick={handleClickPin} active={isPinned}>
          <FontAwesomeIcon icon={pinnedIcon} size="sm" />
        </PinnedContainer>
        <TextContainer>
          <Typography noWrap variant="body2">
            {name}
          </Typography>
        </TextContainer>
      </NameContainer>
    </Tooltip>
  );
}

export default CellName;
