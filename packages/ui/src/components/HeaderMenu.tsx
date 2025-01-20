import { ReactElement, useState, MouseEvent, KeyboardEvent } from "react";
import { v1 } from "uuid";
import {
  MenuItem,
  Popper,
  MenuList,
  IconButton,
  Fade,
  Paper,
  ClickAwayListener,
  PopperPlacementType,
} from "@mui/material";
import { faXmark, faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { makeStyles } from "@mui/styles";
import Link from "./Link";
import PrivateWrapper from "./PrivateWrapper";

const useStyles = makeStyles(() => ({
  icon: {
    marginLeft: "20px",
  },
  menuLink: {
    width: "100%",
    paddingTop: "8px",
    paddingBottom: "8px",
    paddingLeft: "16px",
    paddingRight: "16px",
  },
  menuItem: {
    paddingLeft: "0px",
    paddingRight: "0px",
  },
}));

type HeaderMenuItem = {
  external: boolean;
  name: string;
  showOnlyPartner?: boolean;
  url: string;
};

type HeaderMenuProps = {
  items: HeaderMenuItem[];
  placement?: PopperPlacementType;
};

function HeaderMenu({ items, placement }: HeaderMenuProps): ReactElement {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuToggle = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl === null ? event.currentTarget : null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleListKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setAnchorEl(null);
    }
  };

  return (
    <>
      <IconButton
        className={classes.icon}
        size="medium"
        color="inherit"
        aria-label="open header menu"
        aria-haspopup="true"
        onClick={handleMenuToggle}
      >
        <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} size="xs" />
      </IconButton>

      <Popper
        open={isMenuOpen}
        anchorEl={anchorEl}
        role={undefined}
        transition
        // disablePortal
        placement={placement || "bottom-start"}
      >
        {({ TransitionProps }) => (
          // TODO: review props spreading
          // eslint-disable-next-line
          <Fade {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleMenuClose}>
                <MenuList onKeyDown={handleListKeyDown}>
                  {items.map((item: HeaderMenuItem) => {
                    if (item.showOnlyPartner) {
                      return (
                        <PrivateWrapper key={v1()}>
                          <MenuItem onClick={handleMenuClose} dense className={classes.menuItem}>
                            <Link
                              external={item.external}
                              to={item.url}
                              className={classes.menuLink}
                              footer={false}
                            >
                              {item.name}
                            </Link>
                          </MenuItem>
                        </PrivateWrapper>
                      );
                    }
                    return (
                      <MenuItem
                        onClick={handleMenuClose}
                        key={v1()}
                        dense
                        className={classes.menuItem}
                      >
                        <Link
                          external={item.external}
                          to={item.url}
                          className={classes.menuLink}
                          footer={false}
                        >
                          {item.name}
                        </Link>
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
}

export default HeaderMenu;
