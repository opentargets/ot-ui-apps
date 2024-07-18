import { Fragment } from "react";
import { flexRender } from "@tanstack/react-table";
import { ClickAwayListener, Fade, Box, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilterCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { grey } from "@mui/material/colors";

import useAotfContext from "../../hooks/useAotfContext";

import { RowContainer, RowsContainer, TableBodyContent, GridContainer } from "../layout";

import { SectionRender, SectionRendererWrapper } from "./SectionRender";

import RowInteractorsWrapper from "../RowInteractors/RowInteractorsWrapper";
import RowInteractorsTable from "../RowInteractors/RowInteractorsTable";
import { useAssociationsFocus } from "../../context/AssociationsFocusContext";

/* HELPERS */
const getColContainerClassName = ({ id }) => {
  if (id === "1_naiming-cols_name") return "group-naiming-cols";
  return "group-entity-cols";
};

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

function TableBody({ core, cols, noInteractors }) {
  const { id, entity, entityToGet, displayedTable } = useAotfContext();

  const focusState = useAssociationsFocus();

  const { rows } = core.getRowModel();
  const { prefix, parentTable, parentRow } = core.getState();

  if (prefix === "pinned" && rows.length < 1) return null;

  if (prefix === "interactors") if (rows.length < 1) return <EmptyMessage />;

  const rowNameEntity = entity === "target" ? "name" : "approvedSymbol";
  const highLevelHeaders = core.getHeaderGroups()[0].headers;
  const handleClickAway = e => {
    if (e.srcElement.className === "CodeMirror-hint CodeMirror-hint-active") {
      return;
    }
    // resetExpandler();
  };

  return (
    <Fade in>
      <TableBodyContent>
        <RowsContainer>
          {rows.map(row => (
            <Fragment key={row.id}>
              <RowContainer
                rowExpanded={
                  focusState.filter(e => e.row === row.id && e.table === prefix).length > 0
                }
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
                        <div key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      );
                    })}
                  </GridContainer>
                ))}
              </RowContainer>
              <Box sx={{ position: "relative", overflow: "hidden" }}>
                <ClickAwayListener onClickAway={handleClickAway}>
                  <section>
                    <SectionRendererWrapper>
                      <SectionRender
                        id={id}
                        entity={entity}
                        table={prefix}
                        section={
                          // TODO: look
                          prefix !== "interactors"
                            ? focusState.find(
                                e => e.row === row.id && e.table === prefix && e.section !== null
                              )?.section
                            : focusState.find(
                                e =>
                                  e.row === parentRow &&
                                  e.table === parentTable &&
                                  e.interactorsRow === row.id &&
                                  e.interactorsSection !== null
                              )?.interactorsSection
                        }
                        row={row}
                        entityToGet={entityToGet}
                        rowNameEntity={rowNameEntity}
                        displayedTable={displayedTable}
                        cols={cols}
                      />
                    </SectionRendererWrapper>
                  </section>
                </ClickAwayListener>

                {!noInteractors && (
                  <RowInteractorsWrapper rowId={row.id} parentTable={prefix}>
                    <RowInteractorsTable
                      row={row}
                      columns={core._getColumnDefs()}
                      rowNameEntity={rowNameEntity}
                      parentTable={prefix}
                    />
                  </RowInteractorsWrapper>
                )}
              </Box>
            </Fragment>
          ))}
        </RowsContainer>
      </TableBodyContent>
    </Fade>
  );
}

export default TableBody;
