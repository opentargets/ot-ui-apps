import { Fragment } from "react";
import { flexRender } from "@tanstack/react-table";
import { ClickAwayListener, Fade, Box, Typography } from "@mui/material";
import { v1 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilterCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { grey } from "@mui/material/colors";

import useAotfContext from "../../hooks/useAotfContext";

import { getCellId } from "../../utils";
import { RowContainer, RowsContainer, TableBodyContent, GridContainer } from "../tableLayout";

import { SectionRender, SectionRendererWrapper } from "./SectionRender";

/* HELPERS */
const getColContainerClassName = ({ id }) => {
  if (id === "1_naiming-cols_name") return "group-naiming-cols";
  return "group-entity-cols";
};

const getRowActive = ({ getIsExpanded }, isExpandedInTable) => getIsExpanded() && isExpandedInTable;

const getCellClassName = (cell, entityToGet, displayedTable, expanded, tablePrefix) => {
  if (cell.column.id === "name") return "name-cell";
  const expandedId = getCellId(cell, entityToGet, displayedTable, tablePrefix).join("-");
  if (expandedId === expanded.join("-")) return "active data-cell";
  return "data-cell";
};

function ExpandableContainer({ rowExpanded, isExpandedInTable, loading, children }) {
  if (!isExpandedInTable || !rowExpanded || loading) return null;
  return <Box key={v1()}>{children}</Box>;
}

function EmptyMessage() {
  return (
    <Box
      sx={{
        width: "auto",
        px: 5,
        py: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          borderRadius: "50%",
          backgroundColor: grey[300],
          display: "flex",
          width: "100px",
          height: "100px",
          justifyContent: "center",
          alignItems: "center",
          mb: 2,
        }}
      >
        <FontAwesomeIcon size="3x" icon={faFilterCircleXmark} />
      </Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        No results found
      </Typography>
      <Typography variant="body">
        Try adjust your search or filter to find what you looking for.
      </Typography>
    </Box>
  );
}

function TableBody({ core, cols }) {
  const { id, entity, entityToGet, displayedTable, resetExpandler, expanded } = useAotfContext();

  const { rows } = core.getRowModel();
  const { prefix, loading } = core.getState();

  if (prefix === "pinned" && rows.length < 1) return null;

  if (rows.length < 1) return <EmptyMessage />;

  const flatCols = ["name", ...cols.map(c => c.id)];

  const rowNameEntity = entity === "target" ? "name" : "approvedSymbol";
  const highLevelHeaders = core.getHeaderGroups()[0].headers;
  const isExpandedInTable = expanded[3] === prefix && flatCols.includes(expanded[1]);

  const handleClickAway = e => {
    if (e.srcElement.className === "CodeMirror-hint CodeMirror-hint-active") {
      return;
    }
    resetExpandler();
  };

  return (
    <Fade in>
      <TableBodyContent>
        <RowsContainer>
          {rows.map(row => (
            <Fragment key={row.id}>
              <RowContainer
                isSubRow={row.depth > 0}
                rowExpanded={getRowActive(row, isExpandedInTable)}
              >
                {highLevelHeaders.map(columnGroup => (
                  <GridContainer
                    columnsCount={cols.length}
                    className={getColContainerClassName(columnGroup)}
                    key={columnGroup.id}
                  >
                    {columnGroup.subHeaders.map(column => {
                      const cell = row.getVisibleCells().find(el => el.column.id === column.id);
                      return (
                        <div
                          key={cell.id}
                          className={getCellClassName(
                            cell,
                            entityToGet,
                            displayedTable,
                            expanded,
                            prefix
                          )}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      );
                    })}
                  </GridContainer>
                ))}
              </RowContainer>

              <ExpandableContainer
                rowExpanded={row.getIsExpanded()}
                isExpandedInTable={isExpandedInTable}
                loading={loading}
              >
                <ClickAwayListener onClickAway={handleClickAway}>
                  <section>
                    <SectionRendererWrapper>
                      <SectionRender
                        id={id}
                        entity={entity}
                        section={expanded[2]}
                        expanded={expanded}
                        rowId={row.original[entityToGet].id}
                        row={row}
                        entityToGet={entityToGet}
                        rowNameEntity={rowNameEntity}
                        displayedTable={displayedTable}
                        cols={cols}
                      />
                    </SectionRendererWrapper>
                  </section>
                </ClickAwayListener>
              </ExpandableContainer>
            </Fragment>
          ))}
        </RowsContainer>
      </TableBodyContent>
    </Fade>
  );
}

export default TableBody;
