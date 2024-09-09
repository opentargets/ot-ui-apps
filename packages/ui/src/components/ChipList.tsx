import { makeStyles } from "@mui/styles";
import { Box, Chip, Theme, Tooltip } from "@mui/material";
import classNames from "classnames";
import { v1 } from "uuid";
import { naLabel } from "../constants";
import { ElementType, ReactElement } from "react";

const useContainerStyles = makeStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.grey[300]}`,
    color: theme.palette.text.primary,
  },
}));

const useChipStyles = makeStyles({
  chip: { margin: "3px 5px 3px 0 !important" },
});

type ChipListItem = {
  customClass?: string;
  label: string;
  tooltip?: string;
  url?: string;
};

type ChipContainerProps = {
  children: ReactElement;
  item: ChipListItem;
};

type ChipListProps = {
  items?: ChipListItem[];
  small?: boolean;
};

function ChipContainer({ item, children }: ChipContainerProps): ReactElement {
  const classes = useContainerStyles();

  return item.tooltip ? (
    <Tooltip placement="top" classes={{ tooltip: classes.tooltip }} title={item.tooltip}>
      {children}
    </Tooltip>
  ) : (
    children
  );
}

/**
 * Display a (horizontal) list of "chips".
 * Each chip can show an optional tooltip.
 * @param items Array of ChipListItems.
 * @param small Display each chip as size="small"
 */
function ChipList({ items, small }: ChipListProps): ReactElement[] | string {
  const classes = useChipStyles();

  if (!items || items.length === 0) return naLabel;

  return items.map(item => {
    const component: ElementType = item.url ? "a" : Box;
    return (
      <ChipContainer key={v1()} item={item}>
        <Chip
          component={component}
          href={item.url}
          className={classNames(classes.chip, item.customClass)}
          clickable={!!item.url}
          target="_blank"
          noopener="true"
          noreferrer="true"
          color="primary"
          label={item.label}
          size={small ? "small" : "medium"}
        />
      </ChipContainer>
    );
  });
}

export default ChipList;
