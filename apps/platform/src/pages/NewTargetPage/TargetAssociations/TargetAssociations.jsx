import React, { Fragment, useState, useMemo, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { scaleQuantize } from 'd3';

import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
} from '@tanstack/react-table';

import TARGET_ASSOCIATIONS_QUERY from './TargetAssociationsQuery.gql';
import dataSources from './dataSourcesAssoc';
import './style.css';
import Checkbox from '@material-ui/core/Checkbox';
import {
  Button,
  Drawer,
  FormGroup,
  FormControlLabel,
  Grid,
  Collapse,
} from '@material-ui/core';
import { styled } from '@material-ui/styles';

import PlatformApiProvider from '../../../contexts/PlatformApiProvider';

import sections from '../../EvidencePage/sections';

import { Reorder, AnimatePresence, motion } from 'framer-motion';

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
  margin: '40px 60px',
  textAlign: 'right',
});

const SectionWrapper = styled('div')({
  marginBottom: '40px',
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

/* UTILS */
/* Color scale */
const COLORS = [
  // '#f7fbff',
  '#deebf7',
  '#c6dbef',
  '#9ecae1',
  '#6baed6',
  '#4292c6',
  '#2171b5',
  '#08519c',
  // '#08306b',
];
const linearScale = scaleQuantize().domain([0, 1]).range(COLORS);

// Select and parsed data from API response
const getAssociatedDiseasesData = data => {
  if (!data) return [];
  return data.target.associatedDiseases.rows.map(d => {
    const sources = d.datasourceScores.reduce(
      (acc, curr) => ((acc[curr.componentId] = curr.score), acc),
      {}
    );
    return { ...d, ...sources };
  });
};

/* TARGET ASSOCIATION PAGE */
function TargetAssociations({ ensgId }) {
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });
  const [_data, setData] = useState([]);
  const [_loading, setLoading] = useState([]);

  const {
    data: associationData,
    loading,
    error,
  } = useQuery(TARGET_ASSOCIATIONS_QUERY, {
    variables: {
      ensemblId: ensgId,
      index: pageIndex,
      size: pageSize,
      filter: '',
      sortBy: 'score',
      aggregationFilters: [],
      enableIndirect: false,
    },
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

  // Viz Controls
  const [gScoreRect, setGScoreRect] = useState(true);
  const [scoreRect, setScoreRect] = useState(false);
  const [open, setOpen] = useState(false);

  const columns = [
    // {
    //   id: 'expander',
    //   header: () => 'Expander',
    //   cell: row => {
    //     return row.row.getCanExpand() ? (
    //       <button
    //         {...{
    //           onClick: () => {
    //             // console.log(row);
    //             row.row.getToggleExpandedHandler();
    //           },
    //           style: { cursor: 'pointer' },
    //         }}
    //       >
    //         {row.row.getIsExpanded() ? '👇' : '👉'}
    //       </button>
    //     ) : (
    //       '🔵'
    //     );
    //   },
    // },
    {
      accessorFn: row => row.disease.name,
      id: 'name',
      cell: row => (
        <NameContainer>
          <Name>{row.getValue()}</Name>
        </NameContainer>
      ),
      // <NameContainer>
      //   <span
      //     onClick={() => {
      //       console.log(row);
      //     }}
      //   >
      //   </span>
      // </NameContainer>
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

  const parsedData = getAssociatedDiseasesData(associationData);

  const table = useReactTable({
    data: parsedData,
    columns,
    state: {
      expanded: tableExpanded,
      pagination,
    },
    pageCount: associationData?.target?.associatedDiseases?.count ?? -1,
    onPaginationChange: setPagination,
    onExpandedChange: setTableExpanded,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    manualPagination: true,
  });

  if (error) return <>Error in request</>;

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
        <Button variant="contained" onClick={() => setOpen(true)}>
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
          <Reorder.Group values={table.getRowModel().rows} onReorder={() => {}}>
            <TableElement>
              {table.getHeaderGroups().map(headerGroup => (
                <div className="Theader" key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    return (
                      <div
                        className={getHeaderClassName(header)}
                        key={header.id}
                        colSpan={header.colSpan}
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
                            <SecctionRenderer
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
            {[10, 50, 200, 500].map(pageSize => (
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

function ColoredCell({ scoreValue, onClick, rounded, globalScore, cell }) {
  const onClickHabdler = onClick ? () => onClick(cell) : () => {};
  const backgroundColor = scoreValue ? linearScale(scoreValue) : '#fafafa';
  const borderColor = scoreValue ? linearScale(scoreValue) : '#e0dede';
  const className = globalScore
    ? 'data-global-score'
    : scoreValue
    ? 'data-score'
    : 'data-empty';

  const style = {
    height: '25px',
    width: rounded ? '26px' : '30px',
    borderRadius: rounded ? '13px' : 0,
    backgroundColor,
    border: `1.5px solid ${borderColor}`,
  };

  return (
    <div className={className} onClick={onClickHabdler} style={style}></div>
  );
}

// Wrapper of the sections
function SecctionRenderer({ ensgId, efoId, label, activeSection }) {
  const toSearch = dataSources.filter(el => el.id === activeSection[0])[0]
    .sectionId;
  const { Body, definition } = sections.filter(
    el => el.definition.id === toSearch
  )[0];

  return (
    <SectionWrapper>
      <Grid id="summary-section" container spacing={1}>
        <Body
          definition={definition}
          id={{ ensgId, efoId }}
          label={{ symbol: definition.shortName, name: definition.name }}
        />
      </Grid>
    </SectionWrapper>
  );
}

export default TargetAssociations;
