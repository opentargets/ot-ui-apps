import FileSaver from "file-saver";
import { Suspense, useState, lazy } from "react";
import _ from "lodash";
import {
  Button,
  Grid,
  Typography,
  CircularProgress,
  Snackbar,
  Slide,
  Drawer,
  Paper,
  IconButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import CloseIcon from "@mui/icons-material/Close";
import "graphiql/graphiql.min.css";
import { fetcher } from "../../utils/global";
import Link from "../Link";

// lazy load GraphiQL and remove Logo and Toolbar
const GraphiQL = lazy(() =>
  import("graphiql").then((module) => {
    module.default.Logo = function () {
      return null;
    };
    module.default.Toolbar = function () {
      return null;
    };
    return module;
  })
);

const asJSON = (columns, rows) => {
  const rowStrings = rows.map((row) =>
    columns.reduce((accumulator, newKey) => {
      if (newKey.exportValue === false) return accumulator;

      const newLabel = _.camelCase(
        newKey.exportLabel || newKey.label || newKey.id
      );

      return {
        ...accumulator,
        [newLabel]: newKey.exportValue
          ? newKey.exportValue(row)
          : _.get(row, newKey.propertyPath || newKey.id, ""),
      };
    }, {})
  );

  return JSON.stringify(rowStrings);
};

const asDSV = (columns, rows, separator = ",", quoteStrings = true) => {
  const quoteString = (d) => {
    let result = d;
    // converts arrays to strings
    if (Array.isArray(d)) {
      result = d.join(",");
    }
    return quoteStrings && typeof result === "string" ? `"${result}"` : result;
  };

  const lineSeparator = "\n";

  const headerString = columns
    .reduce((accHeaderString, column) => {
      if (column.exportValue === false) return accHeaderString;

      const newLabel = quoteString(
        _.camelCase(column.exportLabel || column.label || column.id)
      );

      return [...accHeaderString, newLabel];
    }, [])
    .join(separator);

  const rowStrings = rows
    .map((row) =>
      columns
        .reduce((rowString, column) => {
          if (column.exportValue === false) return rowString;

          const newValue = quoteString(
            column.exportValue
              ? column.exportValue(row)
              : _.get(row, column.propertyPath || column.id, "")
          );

          return [...rowString, newValue];
        }, [])
        .join(separator)
    )
    .join(lineSeparator);

  return [headerString, rowStrings].join(lineSeparator);
};

const createBlob = (format) =>
  ({
    json: (columns, rows) =>
      new Blob([asJSON(columns, rows)], {
        type: "application/json;charset=utf-8",
      }),
    csv: (columns, rows) =>
      new Blob([asDSV(columns, rows)], {
        type: "text/csv;charset=utf-8",
      }),
    tsv: (columns, rows) =>
      new Blob([asDSV(columns, rows, "\t", false)], {
        type: "text/tab-separated-values;charset=utf-8",
      }),
  }[format]);

const styles = makeStyles((theme) => ({
  messageProgress: {
    marginRight: "1rem",
  },
  snackbarContentMessage: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: ".75rem 1rem",
    width: "100%",
  },
  snackbarContentRoot: {
    padding: 0,
  },
  backdrop: {
    "& .MuiBackdrop-root": {
      opacity: "0 !important",
    },
  },
  container: {
    width: "80%",
    backgroundColor: theme.palette.grey[300],
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

function DataDownloader({ columns, rows, fileStem, query, variables }) {
  const [downloading, setDownloading] = useState(false);
  const [open, setOpen] = useState(false);
  const classes = styles();

  const downloadData = async (format, dataColumns, dataRows, dataFileStem) => {
    let allRows = dataRows;

    if (typeof dataRows === "function") {
      setDownloading(true);
      allRows = await dataRows();
      setDownloading(false);
    }

    if (!allRows || allRows.length === 0) {
      return;
    }

    const blob = createBlob(format)(dataColumns, allRows);

    FileSaver.saveAs(blob, `${dataFileStem}.${format}`, { autoBOM: false });
  };

  const handleClickDownloadJSON = async () => {
    downloadData("json", columns, rows, fileStem);
  };

  const handleClickDownloadTSV = async () => {
    downloadData("tsv", columns, rows, fileStem);
  };

  function togglePlayground() {
    setOpen(!open);
  }

  function close(e) {
    if (e.key === "Escape") return;
    setOpen(false);
  }

  return (
    <>
      <Grid container alignItems="center" justifyContent="flex-end" spacing={1}>
        <Grid item>
          <Typography variant="caption">Download table as</Typography>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            onClick={handleClickDownloadJSON}
            size="small"
          >
            JSON
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            onClick={handleClickDownloadTSV}
            size="small"
          >
            TSV
          </Button>
        </Grid>
        {query ? (
          <Grid item>
            <Button
              variant="outlined"
              size="small"
              onClick={() => togglePlayground()}
            >
              API query
            </Button>
          </Grid>
        ) : null}
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={downloading}
        TransitionComponent={Slide}
        ContentProps={{
          classes: {
            root: classes.snackbarContentRoot,
            message: classes.snackbarContentMessage,
          },
        }}
        message={
          <>
            <CircularProgress className={classes.messageProgress} />
            Preparing data...
          </>
        }
      />
      <Drawer
        classes={{ root: classes.backdrop, paper: classes.container }}
        open={open}
        onClose={(e) => close(e)}
        anchor="right"
      >
        <Typography className={classes.title}>
          API query
          <IconButton onClick={(e) => close(e)}>
            <CloseIcon />
          </IconButton>
        </Typography>
        <Paper className={classes.paper} variant="outlined">
          Press the Play button to explore the GraphQL API query used to
          populate this table. You can also visit our{" "}
          <Link
            external
            to="https://platform-docs.opentargets.org/data-access/graphql-api"
          >
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

export default DataDownloader;
