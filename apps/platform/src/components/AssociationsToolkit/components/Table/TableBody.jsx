import { Fragment } from "react";
import { flexRender } from "@tanstack/react-table";
import { Fade, Box, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilterCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { grey } from "@mui/material/colors";

import useAotfContext from "../../hooks/useAotfContext";
import { useAssociationsFocus } from "../../context/AssociationsFocusContext";

import { SectionRender, SectionRendererWrapper } from "./SectionRender";
import RowInteractorsWrapper from "../RowInteractors/RowInteractorsWrapper";
import RowInteractorsTable from "../RowInteractors/RowInteractorsTable";
import { RowContainer, RowsContainer, TableBodyContent, GridContainer } from "../layout";
import { rowNameProperty, TABLE_PREFIX } from "../../utils";

/* HELPERS */
const getColContainerClassName = ({ id }) => {
  if (id === "1_naiming-cols_name") return "group-naiming-cols";
  return "group-entity-cols";
};

function getIsRowActive(prefix, row, focusState = [], parentRow, parentTable) {
  if (prefix === TABLE_PREFIX.INTERACTORS) {
    return focusState.some(
      entry =>
        entry.row === parentRow &&
        entry.table === parentTable &&
        entry.interactorsRow === row.id &&
        entry.interactorsSection !== null
    );
  }

  return focusState.some(
    entry =>
      entry.row === row.id &&
      entry.table === prefix &&
      (entry.section !== null || entry.interactors)
  );
}

function getFocusSection(prefix, row, focusState, parentRow, parentTable) {
  if (prefix === TABLE_PREFIX.INTERACTORS) {
    return focusState.find(
      entry =>
        entry.row === parentRow &&
        entry.table === parentTable &&
        entry.interactorsRow === row.id &&
        entry.interactorsSection !== null
    )?.interactorsSection;
  }

  return focusState.find(
    entry => entry.row === row.id && entry.table === prefix && entry.section !== null
  )?.section;
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

const borderStyle = `1px solid ${grey[400]}`;

function TableBody({ core, cols, noInteractors }) {
  const { id, entity, entityToGet, displayedTable } = useAotfContext();

  const focusState = useAssociationsFocus();

  const { rows } = core.getRowModel();
  const { prefix, parentTable, parentRow } = core.getState();

  if (prefix === TABLE_PREFIX.PINNING && rows.length < 1) return <></>;

  if (prefix === TABLE_PREFIX.INTERACTORS || prefix === TABLE_PREFIX.CORE)
    if (rows.length < 1) return <EmptyMessage />;

  const nameProperty = rowNameProperty[entity];
  const highLevelHeaders = core.getHeaderGroups()[0].headers;

  return (
    <Fade in>
      <TableBodyContent>
        <RowsContainer>
          {rows.map(row => (
            <Fragment key={row.id}>
              <RowContainer
                interactors={prefix === TABLE_PREFIX.INTERACTORS}
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

              <Box
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  borderBottom: prefix === TABLE_PREFIX.INTERACTORS ? null : borderStyle,
                  borderLeft: prefix === TABLE_PREFIX.INTERACTORS ? null : borderStyle,
                  borderRight: prefix === TABLE_PREFIX.INTERACTORS ? null : borderStyle,
                  marginBottom: 1,
                  display: getIsRowActive(prefix, row, focusState, parentRow, parentTable)
                    ? "block"
                    : "none",
                }}
              >
                <SectionRendererWrapper
                  section={getFocusSection(prefix, row, focusState, parentRow, parentTable)}
                >
                  <section>
                    <SectionRender
                      id={id}
                      entity={entity}
                      table={prefix}
                      row={row}
                      entityToGet={entityToGet}
                      nameProperty={nameProperty}
                      displayedTable={displayedTable}
                      cols={cols}
                      section={getFocusSection(prefix, row, focusState, parentRow, parentTable)}
                    />
                  </section>
                </SectionRendererWrapper>
                {!noInteractors && (
                  <RowInteractorsWrapper rowId={row.id} parentTable={prefix}>
                    <RowInteractorsTable
                      row={row}
                      columns={core._getColumnDefs()}
                      nameProperty={nameProperty}
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
