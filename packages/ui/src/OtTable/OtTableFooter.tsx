import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Grid, makeStyles, MenuItem, Select } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles(() => ({
  tableControls: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem 1rem",
  },
  rowsControls: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
  },
}));

type OtTableFooterProps = {
  //TODO
  table: any;
  initialLoad: Boolean;
  showLastPageControl: Boolean;
};

function OtTableFooter({
  table,
  initialLoad = false,
  showLastPageControl = true,
}:OtTableFooterProps) {
  const classes = useStyles();

  if (initialLoad)
    return (
      <>
        <Grid container justifyContent="space-between">
          <Skeleton animation="wave" width="10%" height="3rem" />
          <Skeleton animation="wave" width="15%" height="3rem" />
        </Grid>
      </>
    );

  return (
    <div className={classes.tableControls}>
      <div className="rowsPerPage">
        <span>Rows per page: {"    "}</span>
        <Select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 25, 100].map((pageSize) => (
            <MenuItem key={pageSize} value={pageSize}>
              {pageSize}
            </MenuItem>
          ))}
        </Select>
      </div>

      <div className={classes.rowsControls}>
        <div className="pageInfo">
          <span>Page </span>
          <span>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>
        </div>

        <div className="paginationAction">
          <Button
            color="primary"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <FontAwesomeIcon size="lg" icon={faAnglesLeft} />
          </Button>
          <Button
            color="primary"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <FontAwesomeIcon size="lg" icon={faAngleLeft} />
          </Button>

          <Button
            color="primary"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <FontAwesomeIcon size="lg" icon={faAngleRight} />
          </Button>
          {showLastPageControl && (
            <Button
              color="primary"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <FontAwesomeIcon size="lg" icon={faAnglesRight} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OtTableFooter;
