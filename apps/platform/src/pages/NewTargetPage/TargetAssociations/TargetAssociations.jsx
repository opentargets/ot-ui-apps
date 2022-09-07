import React, { Fragment, useState, useMemo } from 'react';
import { gql } from '@apollo/client';

import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Reorder, motion } from 'framer-motion';

import dataSources from './dataSourcesAssoc';
import './style.css';
import Checkbox from '@material-ui/core/Checkbox';
import { Button, Drawer, FormGroup, FormControlLabel } from '@material-ui/core';
import { styled } from '@material-ui/styles';

import PlatformApiProvider from '../../../contexts/PlatformApiProvider';
import useTargetAssociations from './useAssociationsData';

import SecctionRender from './SectionRender';
import ColoredCell from './ColoredCell';
import WeightsControlls from './WeightsControlls';
import DataMenu from './DataMenu';

const EVIDENCE_PROFILE_QUERY = gql`
  query EvidenceProfileQuery($ensgId: String!) {
    target(ensemblId: $ensgId) {
      id
      approvedSymbol
      approvedName
      functionDescriptions
      synonyms {
        label
        source
      }
    }
  }
`;

/* Styled component */
const ControllsBtnContainer = styled('div')({
  marginTop: '30px',
  marginBottom: '15px',
  textAlign: 'right',
});

const ControllsContainer = styled('div')({
  margin: '40px',
  minWidth: '400px',
});

const TableElement = styled('div')({
  minWidth: '1250px',
  maxWidth: '1500px',
  margin: '0 auto',
});

const NameContainer = styled('div')({
  display: 'block',
  overflow: 'hidden',
  textAlign: 'end',
  textOverflow: 'ellipsis',
  maxWidth: '300px',
});

const Name = styled('span')({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

/* TARGET ASSOCIATION TABLE */
function TargetAssociations({ ensgId }) {
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  // Table Controls
  const [expanded, setExpanded] = useState([]);
  const [tableExpanded, setTableExpanded] = useState({});

  // Data controls
  const [enableIndirect, setEnableIndirect] = useState(false);
  // Data controls UI
  const [activeWeightsControlls, setActiveWeightsControlls] = useState(false);
  const [activeAdvanceControlls, setActiveAdvanceControlls] = useState(false);

  // Viz Controls
  const [gScoreRect, setGScoreRect] = useState(true);
  const [scoreRect, setScoreRect] = useState(false);
  const [open, setOpen] = useState(false);

  const { data, initialLoading, loading } = useTargetAssociations({
    ensemblId: ensgId,
    index: pageIndex,
    size: pageSize,
    filter: '',
    sortBy: 'score',
    enableIndirect,
  });

  const columns = [
    {
      accessorFn: row => row.disease.name,
      id: 'name',
      cell: row => (
        <NameContainer>
          <Name>{row.getValue()}</Name>
        </NameContainer>
      ),
      header: () => <span>Disease</span>,
      footer: props => props.column.id,
    },
    {
      accessorFn: row => row.score,
      id: 'score',
      cell: row => (
        <ColoredCell
          scoreValue={row.getValue()}
          globalScore
          rounded={!gScoreRect}
        />
      ),
      header: () => <span>Score</span>,
      footer: props => props.column.id,
    },
    ...getDatasources(),
  ];

  const handlePaginationChange = pagination => {
    setTableExpanded({});
    setExpanded([]);
    setPagination(pagination);
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded: tableExpanded,
      pagination,
    },
    pageCount: data?.target?.associatedDiseases?.count ?? -1,
    onPaginationChange: handlePaginationChange,
    onExpandedChange: setTableExpanded,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowId: row => row.disease.id,
    manualPagination: true,
  });

  if (initialLoading) return <>Initial loading</>;

  const getCellId = cell => {
    const sourceId = cell.column.id;
    const diseaseId = cell.row.original.disease.id;
    return [sourceId, diseaseId];
  };

  /* Expander handler for data-score elements */
  const expanderHandler = tableExpanderController => cell => {
    const expandedId = getCellId(cell);
    if (expanded.join('-') === expandedId.join('-')) {
      setTableExpanded({});
      setExpanded([]);
      return;
    }
    /* Validate that only one row can be expanded */
    if (Object.keys(tableExpanded).length > 0) setTableExpanded({});
    /* Open the expandable section */
    tableExpanderController();
    /* Set the ID of the section expanded element */
    setExpanded(expandedId);
  };

  function getDatasources() {
    return dataSources.map(({ id, label }) => ({
      id,
      header: label,
      accessorFn: row => row[id],
      cell: row =>
        row.getValue() ? (
          <ColoredCell
            scoreId={id}
            scoreValue={row.getValue()}
            onClick={expanderHandler(row.row.getToggleExpandedHandler())}
            rounded={!scoreRect}
            cell={row}
          />
        ) : (
          <ColoredCell rounded={!scoreRect} />
        ),
    }));
  }

  const getHeaderClassName = ({ id }) => {
    if (id === 'name') return 'header-name';
    if (id === 'score') return 'rotate header-score';
    return 'rotate';
  };

  const getRowClassName = ({ getIsExpanded }) => {
    let activeClass = getIsExpanded() ? 'active' : '';
    return `data-row ${activeClass}`;
  };
  const getCellClassName = cell => {
    if (cell.column.id === 'name') return 'name-cell';
    const expandedId = getCellId(cell).join('-');
    if (expandedId === expanded.join('-')) return 'active data-cell';
    return 'data-cell';
  };

  return (
    <>
      <ControllsBtnContainer>
        <DataMenu
          active={activeAdvanceControlls}
          setActive={setActiveAdvanceControlls}
          enableIndirect={enableIndirect}
          setEnableIndirect={setEnableIndirect}
          activeWeightsControlls={activeWeightsControlls}
          setActiveWeightsControlls={setActiveWeightsControlls}
        />
        <br />
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          disableElevation
        >
          Viz Controlls
        </Button>

        <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
          <ControllsContainer>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={gScoreRect}
                    onChange={() => setGScoreRect(!gScoreRect)}
                  />
                }
                label="Global score rect"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={scoreRect}
                    onChange={() => setScoreRect(!scoreRect)}
                  />
                }
                label="Score rect"
              />
            </FormGroup>
          </ControllsContainer>
        </Drawer>
      </ControllsBtnContainer>
      <PlatformApiProvider
        lsSectionsField="evidence"
        entity="disease"
        query={EVIDENCE_PROFILE_QUERY}
        variables={{ ensgId }}
      >
        <div className="TAssociations">
          <Reorder.Group
            as="div"
            values={table.getRowModel().rows}
            onReorder={() => {}}
          >
            <TableElement>
              {/* HEADER */}
              {table.getHeaderGroups().map(headerGroup => (
                <div className="Theader" key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    return (
                      <div
                        className={getHeaderClassName(header)}
                        key={header.id}
                      >
                        {header.isPlaceholder ? null : (
                          <div>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Weights controlls */}
              <WeightsControlls
                active={activeWeightsControlls}
                cols={table.getHeaderGroups()}
              />

              {/* CONTENT */}
              <div className="TBody">
                <div>
                  {table.getRowModel().rows.map(row => {
                    return (
                      <Fragment key={row.id}>
                        <Reorder.Item
                          as="div"
                          key={row.id}
                          value={row}
                          className={getRowClassName(row)}
                          drag={false}
                        >
                          {row.getVisibleCells().map(cell => {
                            return (
                              <div
                                key={cell.id}
                                className={getCellClassName(cell)}
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </div>
                            );
                          })}
                        </Reorder.Item>
                        {row.getIsExpanded() && (
                          <motion.div
                            key={`${row.original.disease.id}-${expanded[0]}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <SecctionRender
                              ensgId={ensgId}
                              efoId={row.original.disease.id}
                              activeSection={expanded}
                            />
                          </motion.div>
                        )}
                      </Fragment>
                    );
                  })}
                </div>
              </div>
            </TableElement>
          </Reorder.Group>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 25, 50, 200, 500].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
          <button
            className="border rounded p-1"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </button>
          <button
            className="border rounded p-1"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </button>
        </div>
      </PlatformApiProvider>
    </>
  );
}

export default TargetAssociations;
