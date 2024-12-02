import { ReactNode, useState } from "react";
import { Typography, Popover, Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";

type DetailPopoverProps = {
  title: string;
  children: ReactNode;
  showIfEmpty: boolean;
  popoverId?: string;
};

export default function DetailPopover({
  title,
  children,
  showIfEmpty = false,
  popoverId = "simple-popover",
}: DetailPopoverProps) {

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  if (!children && !showIfEmpty) return null;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? popoverId : undefined;

  return (
    <>
      <Typography
        variant="subtitle2"
        sx={{
          display: "inline",
          cursor: children ? "pointer" : null,
          mr: 0.5,
          fontWeight: 600,
          color: "secondary.main"
        }}
        aria-describedby={id}
        onClick={handleClick}
      >
        {title}
        {children && <>
          {" "}
          <FontAwesomeIcon icon={open ? faCaretDown : faCaretRight} />
        </>
        }
      </Typography>
      {children &&
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          elevation={1}
          disableScrollLock
          transitionDuration={0}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Box p={2}>{children}</Box>
        </Popover>
      }
    </>
  );
}