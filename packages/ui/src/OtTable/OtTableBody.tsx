import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Typography, makeStyles } from "@material-ui/core";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import OtTableColumnFilter from "./OtTableColumnFilter";
import { Skeleton } from "@material-ui/lab";
import { flexRender } from "@tanstack/react-table";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    width: "100%",
    overflowX: "auto",
    marginTop: "2rem",
  },
  table: {
    whiteSpace: "nowrap",
    borderCollapse: "collapse",
    minWidth: "100%",
    "& thead": {
      "& tr": {
        "&:hover": {
          backgroundColor: "transparent",
        },
        "&:first-child:not(:last-child)": {
          "& th:not(:last-child)": {
            borderRight: "1px solid lightgrey",
          },
        },
      },
    },
    "& tr": {
      // TODO update broder color
      borderBottom: "1px solid lightgrey",
      "&:hover": {
        backgroundColor: "#f6f6f6",
      },
      "& td": {
        padding: "0.25rem 0.5rem",
      },
      "& th": {
        padding: "1rem 0.5rem",
      },
    },
  },
  tableColumnHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },
  stickyColumn: {
    left: "0",
    position: "sticky",
    backgroundColor: theme.palette.grey[100],
    zIndex: 1,
  },
  verticalHeaders: {
    writingMode: "vertical-rl",
    transform: "rotate(180deg)",
    // TODO: TBC
    maxHeight: "20rem",
    height: "14rem",
  },
  cursorPointer: {
    cursor: "pointer",
  },
  cursorAuto: {
    cursor: "auto",
  },
}));

type OtTableBodyProps = {
  // TODO
  table: any;
  initialLoad: Boolean;
  tableDataLoading: Boolean;
  verticalHeaders: Boolean;
};

function OtTableBody({
  table,
  initialLoad = false,
  tableDataLoading = false,
  verticalHeaders = false,
}: OtTableBodyProps) {
  if (tableDataLoading || initialLoad)
    return (
      <Skeleton animation="wave" variant="rect" width="100%" height="30rem" />
    );

  const classes = useStyles();

  return (
    <div className={classes.tableContainer}>
      <table className={classes.table}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={
                      header.column.columnDef.sticky ? classes.stickyColumn : ""
                    }
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          className={`${classes.tableColumnHeader} ${
                            header.column.getCanSort()
                              ? classes.cursorPointer
                              : classes.cursorAuto
                          }`}
                        >
                          <Typography
                            className={`${
                              verticalHeaders ||
                              header.column.columnDef.verticalHeader
                                ? classes.verticalHeaders
                                : ""
                            }`}
                            onClick={header.column.getToggleSortingHandler()}
                            variant="subtitle2"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: (
                                <FontAwesomeIcon size="sm" icon={faArrowUp} />
                              ),
                              desc: (
                                <FontAwesomeIcon size="sm" icon={faArrowDown} />
                              ),
                            }[header.column.getIsSorted() as string] ?? null}
                          </Typography>
                          {header.column.getCanFilter() ? (
                            <OtTableColumnFilter
                              column={header.column}
                              table={table}
                            />
                          ) : null}
                        </div>
                      </>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {!tableDataLoading &&
            table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        className={
                          cell.column.columnDef.sticky
                            ? classes.stickyColumn
                            : ""
                        }
                      >
                        <Typography variant="body2">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Typography>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default OtTableBody;
