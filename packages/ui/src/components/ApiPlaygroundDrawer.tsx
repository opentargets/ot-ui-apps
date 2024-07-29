import { faPlay, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Drawer, Grid, IconButton, Paper } from "@mui/material";

import Link from "./Link";
import { KeyboardEvent, ReactElement, Suspense, lazy, useState } from "react";
import { fetcher } from "../utils/global";

// lazy load GraphiQL and remove Logo and Toolbar
const GraphiQL = lazy(() =>
  import("graphiql").then(module => {
    function GraphiQLEmpty() {
      return <></>;
    }
    GraphiQLEmpty.displayName = "";

    module.default.Toolbar = GraphiQLEmpty;
    module.default.Logo = GraphiQLEmpty;

    return module;
  })
);

type ApiPlaygroundDrawerProps = {
  query: string;
  variables: any;
  fullHeight: boolean;
};

function ApiPlaygroundDrawer({
  query,
  variables,
  fullHeight,
}: ApiPlaygroundDrawerProps): ReactElement {
  const [open, setOpen] = useState(false);

  function close(e: KeyboardEvent<HTMLInputElement>) {
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
          <Button
            sx={{ display: "flex", gap: 1, ...(fullHeight && { height: 1, maxHeight: "45px" }) }}
            variant="outlined"
            size="small"
            onClick={() => togglePlayground()}
          >
            <FontAwesomeIcon icon={faPlay} />
            API query
          </Button>
        </Grid>
      ) : null}
      <Drawer
        sx={{ width: "80%", overflowY: "hidden" }}
        PaperProps={{
          sx: { width: "80%", overflowY: "hidden" },
        }}
        open={open}
        onClose={e => close(e)}
        anchor="right"
      >
        <Box
          sx={{
            typography: "h6",
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "white",
            borderBottom: "1px solid #ccc",
            fontWeight: "bold",
            p: theme => theme.spacing(2),
          }}
        >
          API query
          <IconButton onClick={e => close(e)}>
            <FontAwesomeIcon icon={faXmark} />
          </IconButton>
        </Box>
        <Paper
          sx={{ m: theme => theme.spacing(2), p: theme => theme.spacing(2) }}
          variant="outlined"
        >
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
          <Box sx={{ height: 1, m: theme => theme.spacing(2), mt: 0 }}>
            <Suspense fallback={<div>Loading...</div>}>
              <GraphiQL
                fetcher={fetcher}
                query={query}
                variables={JSON.stringify(variables, null, 2)}
              />
            </Suspense>
          </Box>
        ) : null}
      </Drawer>
    </>
  );
}

export default ApiPlaygroundDrawer;
