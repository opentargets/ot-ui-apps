import { Avatar, ListItem, ListItemText } from "@material-ui/core";
import classNames from "classnames";
import { Draggable } from "react-beautiful-dnd";
import { DragIndicator } from "@mui/icons-material";
import { scroller } from "react-scroll";

import navPanelStyles from "./navPanelStyles";
// import useSectionOrder from '../../hooks/useSectionOrder';

function SectionMenuItem({ index, section }) {
  const classes = navPanelStyles();
  // const { shouldRender } = useSectionOrder();
  const { id, name, shortName } = section.props.definition;

  const handleSectionButtonClick = (sectionId) => {
    scroller.scrollTo(sectionId, {
      duration: 500,
      smooth: true,
    });
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          // TODO: review props spreading
          // eslint-disable-next-line
          {...provided.draggableProps}
          // TODO: review props spreading
          // eslint-disable-next-line
          {...provided.dragHandleProps}
        >
          <ListItem
            button
            className={classes.listItem}
            onClick={() => handleSectionButtonClick(id)}
          >
            <Avatar
              className={classNames({
                [classes.listItemAvatar]: true,
                // [classes.listItemAvatarHasData]: shouldRender(section),
              })}
            >
              {shortName}
            </Avatar>
            <ListItemText
              className={classes.listItemText}
              primary={name}
              primaryTypographyProps={{
                className: classes.listItemLabel,
              }}
            />
            <DragIndicator className={classes.dragIndicator} />
          </ListItem>
        </div>
      )}
    </Draggable>
  );
}

export default SectionMenuItem;
