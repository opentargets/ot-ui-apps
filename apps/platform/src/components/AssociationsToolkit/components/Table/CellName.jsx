import { useState, useRef } from "react";
import {
  styled,
  Typography,
  MenuList,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Popover,
  Box,
  Fade,
  Skeleton,
} from "@mui/material";
import {
  faThumbTack,
  faEllipsisVertical,
  faArrowUpRightFromSquare,
  faTrashCan,
  faBezierCurve,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";
import useAotfContext from "../../hooks/useAotfContext";
import { ENTITIES } from "../../utils";
import { grey } from "@mui/material/colors";
import {
  FocusActionType,
  useAssociationsFocusDispatch,
} from "../../context/AssociationsFocusContext";

const StyledMenuItem = styled(MenuItem)({
  "&>.MuiListItemIcon-root>svg": {
    fontSize: "1rem",
  },
});

const NameContainer = styled("div")({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginLeft: 5,
  "&:hover": {
    cursor: "pointer",
  },
  "&:hover > .ContextMenuContainer": {
    opacity: 1,
  },
});

const ScoreIndicator = styled("div")({
  width: "16px",
  height: "16px",
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

const ContextMenuContainer = styled("div", {
  shouldForwardProp: prop => prop !== "active",
})(({ active, theme }) => ({
  opacity: active ? "1" : "0",
  cursor: "pointer",
  borderRadius: 5,
  transition: "all 100ms ease",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "3px 0",
  width: "12px",
  marginLeft: theme.spacing(1),
  background: active ? grey[200] : grey[300],
  "&:hover": {
    backgroundColor: grey[200],
  },
}));

function CellName({ cell, colorScale }) {
  const history = useHistory();
  const contextMenuRef = useRef();
  const { entityToGet, pinnedEntries, setPinnedEntries, id: currentEntityId } = useAotfContext();
  const { loading, prefix } = cell.table.getState();
  const name = cell.getValue();
  const { id } = cell.row;
  const { score } = cell.row.original;
  const scoreIndicatorColor = colorScale(score);
  const [openContext, setOpenContext] = useState(false);
  const dispatch = useAssociationsFocusDispatch();

  const isPinned = pinnedEntries.find(e => e === id);
  const profileURL = `/${entityToGet}/${id}`;
  const associationsURL = `/${entityToGet}/${id}/associations`;
  // Using entity to get for condition instead of entity because we are already fetching entityToGet from aotfContext
  const evidenceURL =
    entityToGet === ENTITIES.TARGET
      ? `/evidence/${id}/${currentEntityId}`
      : `/evidence/${currentEntityId}/${id}`;

  const handleClose = () => {
    setOpenContext(false);
    dispatch({
      type: FocusActionType.CLEAR_FOCUS_CONTEXT_MENU,
      focus: {
        table: prefix,
        row: cell.row.id,
      },
    });
  };

  const handleToggle = () => {
    setOpenContext(true);
    dispatch({
      type: FocusActionType.SET_FOCUS_CONTEXT_MENU,
      focus: {
        table: prefix,
        row: cell.row.id,
      },
    });
  };

  const handleClickInteractors = () => {
    dispatch({
      type: FocusActionType.SET_INTERACTORS_ON,
      focus: {
        table: prefix,
        row: cell.row.id,
      },
    });
    setOpenContext(false);
  };

  const handleClickPin = () => {
    if (isPinned) {
      const newPinnedData = pinnedEntries.filter(e => e !== id);
      setPinnedEntries(newPinnedData);
      dispatch({
        type: FocusActionType.CLEAR_FOCUS_CONTEXT_MENU,
        focus: {
          table: prefix,
          row: cell.row.id,
        },
      });
    } else {
      setPinnedEntries([...pinnedEntries, id]);
      dispatch({
        type: FocusActionType.CLEAR_FOCUS_CONTEXT_MENU,
        focus: {
          table: prefix,
          row: cell.row.id,
        },
      });
    }
    setOpenContext(false);
  };

  const handleNavigateToProfile = () => {
    history.push(profileURL);
  };

  const handleNavigateToAssociations = () => {
    history.push(associationsURL);
  };

  const handleNavigateToEvidence = () => {
    history.push(evidenceURL);
  };

  const loadingWidth = entityToGet === ENTITIES.TARGET ? 50 : 150;
  const loadingMargin = entityToGet === ENTITIES.TARGET ? 12 : 2;

  if (loading)
    return <Skeleton width={loadingWidth} height={35} sx={{ marginLeft: loadingMargin }} />;

  return (
    <NameContainer>
      <TextContainer onClick={handleToggle}>
        <Typography width="150px" noWrap variant="body2">
          {name}
        </Typography>
      </TextContainer>
      <ContextMenuContainer
        ref={contextMenuRef}
        className="ContextMenuContainer"
        onClick={handleToggle}
        active={openContext}
      >
        <FontAwesomeIcon icon={faEllipsisVertical} size="lg" />
      </ContextMenuContainer>
      <Popover
        id="context-menu"
        open={openContext}
        anchorEl={contextMenuRef.current}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        TransitionComponent={Fade}
        transitionDuration={200}
        elevation={2}
        disableScrollLock
      >
        <MenuList dense>
          <Box sx={{ paddingX: 2, paddingBottom: 1, display: "flex", alignItems: "center" }}>
            <Box mr={1}>
              <ScoreIndicator style={{ backgroundColor: scoreIndicatorColor }} />
            </Box>
            <Typography variant="subtitle2">{name}</Typography>
          </Box>
          <Divider sx={{ marginBottom: 1 }} />
          {!isPinned && (
            <StyledMenuItem onClick={handleClickPin}>
              <ListItemIcon>
                <FontAwesomeIcon icon={faThumbTack} />
              </ListItemIcon>
              <ListItemText>Pin {entityToGet}</ListItemText>
            </StyledMenuItem>
          )}
          {isPinned && (
            <StyledMenuItem onClick={handleClickPin}>
              <ListItemIcon>
                <FontAwesomeIcon icon={faTrashCan} />
              </ListItemIcon>
              <ListItemText>Unpin {entityToGet}</ListItemText>
            </StyledMenuItem>
          )}
          {entityToGet === ENTITIES.TARGET && <Divider />}
          {entityToGet === ENTITIES.TARGET && (
            <StyledMenuItem
              onClick={() => {
                handleClickInteractors();
              }}
            >
              <ListItemIcon>
                <FontAwesomeIcon icon={faBezierCurve} />
              </ListItemIcon>
              <ListItemText>Target interactors</ListItemText>
            </StyledMenuItem>
          )}

          <Divider />
          <StyledMenuItem onClick={handleNavigateToEvidence}>
            <ListItemIcon>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </ListItemIcon>
            <ListItemText>Navigate to evidence</ListItemText>
          </StyledMenuItem>
          <Divider />
          <StyledMenuItem onClick={handleNavigateToProfile}>
            <ListItemIcon>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </ListItemIcon>
            <ListItemText>Navigate to profile</ListItemText>
          </StyledMenuItem>
          <StyledMenuItem onClick={handleNavigateToAssociations}>
            <ListItemIcon>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </ListItemIcon>
            <ListItemText>Navigate to associations</ListItemText>
          </StyledMenuItem>
        </MenuList>
      </Popover>
    </NameContainer>
  );
}

export default CellName;
