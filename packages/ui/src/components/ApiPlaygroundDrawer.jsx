import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Drawer, Grid, IconButton, Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

import Link from "./Link";
import { Suspense, lazy, useState } from "react";
import { fetcher } from "../utils/global";

const styles = makeStyles(theme => ({
  backdrop: {
    "& .MuiBackdrop-root": {
      opacity: "0 !important",
    },
  },
  container: {
    width: "80%",
    backgroundColor: theme.palette.grey[300],
    overflowY: "hidden !important",
  },
  paper: {
    margin: "1.5rem",
    padding: "1rem",
  },
  title: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderBottom: "1px solid #ccc",
    fontSize: "1.2rem",
    fontWeight: "bold",
    padding: "1rem",
  },
  playgroundContainer: {
    margin: "0 1.5rem 1.5rem 1.5rem",
    height: "100%",
  },
}));

// lazy load GraphiQL and remove Logo and Toolbar
const GraphiQL = lazy(() =>
  import("graphiql").then(module => {
    // eslint-disable-next-line react/display-name
    module.default.Logo = function () {
      return null;
    };
    // eslint-disable-next-line react/display-name
    module.default.Toolbar = function () {
      return null;
    };
    return module;
  })
);

function ApiPlaygroundDrawer({ query, variables }) {
  const classes = styles();
  const [open, setOpen] = useState(false);

  function close(e) {
    if (e.key === "Escape") return;
    setOpen(false);
  }
  function togglePlayground() {
    setOpen(!open);
  }

  return (
    <>
      {" "}
      {query ? (
        <Grid item>
          <Button variant="outlined" size="small" onClick={() => togglePlayground()}>
            API query
          </Button>
        </Grid>
      ) : null}
      <Drawer
        classes={{ root: classes.backdrop, paper: classes.container }}
        open={open}
        onClose={e => close(e)}
        anchor="right"
      >
        <Typography className={classes.title}>
          API query
          <IconButton onClick={e => close(e)}>
            <FontAwesomeIcon icon={faXmark} />
          </IconButton>
        </Typography>
        <Paper className={classes.paper} variant="outlined">
          Press the Play button to explore the GraphQL API query used to populate this table. You
          can also visit our{" "}
          <Link external to="https://platform-docs.opentargets.org/data-access/graphql-api">
            GraphQL API documentation
          </Link>{" "}
          and{" "}
          <Link external to="https://community.opentargets.org">
            Community
          </Link>{" "}
          for more how-to guides and tutorials.
        </Paper>
        {query ? (
          <div className={classes.playgroundContainer}>
            <Suspense fallback={<div>Loading...</div>}>
              <GraphiQL
                fetcher={fetcher}
                query={query}
                variables={JSON.stringify(variables, null, 2)}
              />
            </Suspense>
          </div>
        ) : null}
      </Drawer>
    </>
  );
}
export default ApiPlaygroundDrawer;
