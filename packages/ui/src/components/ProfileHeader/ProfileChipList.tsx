import { Box, Skeleton, Typography, Tooltip, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ReactNode } from "react";

import _ from "lodash";
import Chip from "../Chip";
import LongList from "../LongList";

const useContainerStyles = makeStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.grey[300]}`,
    color: theme.palette.text.primary,
  },
}));

type ChipListItem = {
  label: string;
  tooltip: string;
};

type ChipListProps = {
  children?: ChipListItem[] | string[];
  inline?: boolean;
  loading: boolean;
  title: string;
};

function ChipList({ children, title, loading = false, inline }: ChipListProps): ReactNode {
  const classes = useContainerStyles();
  if (inline && loading) return <Skeleton />;

  if (!children || children.length === 0) return null;

  return (
    <Box data-testid={`profile-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <Typography variant="subtitle2" display={inline ? "inline" : ""}>
        {title}
        {inline ? ": " : ""}
      </Typography>
      {loading ? (
        <Skeleton />
      ) : (
        <LongList
          terms={children}
          maxTerms={10}
          render={(item: ChipListItem | string) => {
            if (_.isString(item)) {
              return <Chip key={item} data-testid={`chip-${item}`} label={item} title={item} />;
            }
            return (
              <Tooltip
                placement="top"
                classes={{ tooltip: classes.tooltip }}
                title={item.tooltip}
                key={item.label}
              >
                <span>
                  <Chip data-testid={`chip-${item.label}`} label={item.label} />
                </span>
              </Tooltip>
            );
          }}
        />
      )}
    </Box>
  );
}

export default ChipList;
