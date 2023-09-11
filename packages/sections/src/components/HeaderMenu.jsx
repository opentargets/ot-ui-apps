import { useState } from "react";
import { v1 } from "uuid";
import {
  MenuItem,
  Popper,
  MenuList,
  IconButton,
  Fade,
  Paper,
  ClickAwayListener,
} from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import Link from "./Link";
import PrivateWrapper from "./PrivateWrapper";

const useStyles = makeStyles((theme) => ({
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

function HeaderMenu({ items, placement }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuToggle = (event) => {
    setAnchorEl(anchorEl === null ? event.currentTarget : null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleListKeyDown = (event) => {
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
        {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
      </IconButton>

      <Popper
        open={isMenuOpen}
        anchorEl={anchorEl}
        role={undefined}
        transition
        disablePortal
        placement={placement || "bottom-start"}
      >
        {({ TransitionProps }) => (
          // TODO: review props spreading
          // eslint-disable-next-line
          <Fade {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleMenuClose}>
                <MenuList onKeyDown={handleListKeyDown}>
                  {items.map((item, i) => {
                    if (item.showOnlyPartner) {
                      return (
                        <PrivateWrapper key={v1()}>
                          <MenuItem
                            onClick={handleMenuClose}
                            dense
                            className={classes.menuItem}
                          >
                            <Link
                              external={item.external}
                              to={item.url}
                              className={classes.menuLink}
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
