import { useEffect } from "react";
import { TablePagination } from "@mui/material";
import useAotfContext from "../../hooks/useAotfContext";
import TableCell from "./TableCell";
import { getLegend } from "../../associationsUtils";
import { styled } from "@mui/styles";

const TableFooterContainer = styled("div")({
  position: "sticky",
  borderTop: "1px solid var(--table-footer-border-color)",
  bottom: 0,
  backgroundColor: " #fafafa",
  padding: "10px",
  display: "flex",
  justifyContent: "space-between",
  zIndex: 100,
  marginTop: 12,
});

function TableFooter({ table, coreOpen }) {
  const { count, loading, pagination, displayedTable } = useAotfContext();

  /**
   * LEGEND EFECT
   */
  useEffect(() => {
    const Legend = getLegend(displayedTable === "associations");
    document.getElementById("legend").innerHTML = "";
    document.getElementById("legend").appendChild(Legend);
  }, [displayedTable]);

  return (
    <TableFooterContainer>
      <div style={{ display: "flex", alignItems: " flex-start" }}>
        <div id="legend" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "10px",
          }}
        >
          <span
            style={{
              fontWeight: "bold",
              fontSize: "10px",
              marginBottom: "3px",
            }}
          >
            No data
          </span>
          <TableCell />
        </div>
      </div>
      <div style={{ display: "flex" }}>
        {coreOpen && (
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 200, 500]}
            component="div"
            count={count}
            rowsPerPage={table.getState().pagination.pageSize}
            page={pagination.pageIndex}
            labelRowsPerPage="Associations per page"
            backIconButtonProps={{
              disableFocusRipple: true,
            }}
            nextIconButtonProps={{
              disableFocusRipple: true,
            }}
            onPageChange={(e, index) => {
              if (!loading) {
                table.setPageIndex(index);
              }
            }}
            onRowsPerPageChange={e => {
              if (!loading) {
                table.setPageSize(Number(e.target.value));
              }
            }}
          />
        )}
      </div>
    </TableFooterContainer>
  );
}

export default TableFooter;
