import { Box, Skeleton, Typography, Tooltip } from "@mui/material";
import { makeStyles } from "@mui/styles";

import _ from "lodash";
import Chip from "../Chip";
import LongList from "../LongList";

const useContainerStyles = makeStyles(theme => ({
  tooltip: {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.grey[300]}`,
    color: theme.palette.text.primary,
  },
}));

function ChipList({ children, title, loading = false, inline }) {
  const classes = useContainerStyles();
  if (inline && loading) return <Skeleton count={1} />;

  if (!children || children.length === 0) return null;

  return (
    <Box>
      <Typography variant="subtitle2" display={inline ? "inline" : ""}>
        {title}
        {inline ? ": " : ""}
      </Typography>
      {loading ? (
        <Skeleton count={1} />
      ) : (
        <LongList
          terms={children}
          maxTerms={10}
          render={item => {
            if (_.isString(item)) {
              return <Chip key={item} label={item} title={item} />;
            }
            return (
              <Tooltip
                placement="top"
                classes={{ tooltip: classes.tooltip }}
                title={item.tooltip}
                key={item.label}
              >
                <span>
                  <Chip label={item.label} />
                </span>
              </Tooltip>
            );
          }}
          size="small"
        />
      )}
    </Box>
  );
}

export default ChipList;
