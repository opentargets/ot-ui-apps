import React, { Fragment, useState } from 'react';
import { useQuery } from '@apollo/client';
import { scaleQuantize } from 'd3';

import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
} from '@tanstack/react-table';

import TARGET_ASSOCIATIONS_QUERY from './TargetAssociationsQuery.gql';
import dataSources from '../../../dataSources';
import './style.css';
import Switch from '@material-ui/core/Switch';
import { Button, Drawer, FormGroup, FormControlLabel } from '@material-ui/core';
import { styled } from '@material-ui/styles';

const ControllsBtnContainer = styled('div')({
  margin: '40px',
  width: '100%',
  textAlign: 'right',
});

const ControllsContainer = styled('div')({
  margin: '40px',
  minWidth: '400px',
});

const TableElement = styled('table')({
  maxWidth: '1500px',
  minWidth: ' 1000px',
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

let linearScale = scaleQuantize().domain([0, 1]).range(COLORS);

function TargetAssociations({ ensgId, symbol }) {
  const { data, loading, error } = useQuery(TARGET_ASSOCIATIONS_QUERY, {
    variables: {
      ensemblId: ensgId,
      index: 1,
      size: 50,
      filter: '',
      sortBy: 'score',
    },
  });

  if (loading) return <>Loading component ...</>;
  if (error) return <>Error in request</>;

  console.table(data.target.associatedDiseases.rows);

  const _data = data.target.associatedDiseases.rows.map(d => {
    const sources = d.datasourceScores.reduce(
      (acc, curr) => ((acc[curr.componentId] = curr.score), acc),
      {}
    );
    return { ...d, ...sources };
  });
  console.log(_data);

  return (
    <>
      <Table data={_data} />
    </>
  );
}

function Table({ data }) {
  const [expanded, setExpanded] = useState(null);
  const [tableExpanded, setTableExpanded] = useState({});

  // Controls
  const [gScoreRect, setGScoreRect] = useState(true);
  const [scoreRect, setScoreRect] = useState(true);
  const [open, setOpen] = useState(false);

  /* Expander handler for data-score elements */
  const expanderHandler = tableExpanderController => scoreId => {
    /* Validate that only one row can be expanded */
    if (Object.keys(tableExpanded).length > 0) setTableExpanded({});
    /* Set the ID of the section expanded element */
    setExpanded(scoreId);
    /* Open the expandable section */
    tableExpanderController();
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
            score={row.getValue()}
            onClick={expanderHandler(row.row.getToggleExpandedHandler())}
            rounded={!scoreRect}
          />
        ) : (
          <ColoredCell rounded={!scoreRect} />
        ),
    }));
  }

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
        <ColoredCell score={row.getValue()} globalScore rounded={!gScoreRect} />
      ),
      header: () => <span>Score</span>,
      footer: props => props.column.id,
    },
    ...getDatasources(),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded: tableExpanded,
    },
    onExpandedChange: setTableExpanded,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

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
                  <Switch
                    checked={gScoreRect}
                    onChange={() => setGScoreRect(!gScoreRect)}
                  />
                }
                label="Global score rect"
              />
              <FormControlLabel
                control={
                  <Switch
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
      <div className="TAssociations">
        <TableElement>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <th
                      className={header.id !== 'name' ? 'rotate' : ''}
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
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => {
              return (
                <Fragment key={row.id}>
                  <tr>
                    {/* first row is a normal row */}
                    {row.getVisibleCells().map(cell => {
                      return (
                        <td
                          key={cell.id}
                          className={
                            cell.column.id === 'name' ? 'nameCell' : ''
                          }
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                  {row.getIsExpanded() && (
                    <tr>
                      {/* 2nd row is a custom 1 cell row */}
                      <td colSpan={row.getVisibleCells().length}>
                        Inner row = {row.original.disease.name}{' '}
                        <b>{expanded}</b>
                        {/* {renderSubComponent({ row })} */}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </TableElement>
      </div>
    </>
  );
}

function ColoredCell({ score, scoreId, onClick, rounded, globalScore }) {
  const onClickHabdler = onClick ? () => onClick(scoreId) : () => {};

  const color = score ? linearScale(score) : '#fafafa';
  const borderColor = score ? linearScale(score) : '#e0dede';
  const className = globalScore
    ? 'data-global-score'
    : score
    ? 'data-score'
    : 'data-empty';

  const style = {
    width: rounded ? '25px' : '30px',
    height: '25px',
    backgroundColor: color,
    borderRadius: rounded ? '12.5px' : 0,
    border: `1px solid ${borderColor}`,
  };
  return (
    <div className={className} onClick={onClickHabdler} style={style}></div>
  );
}

export default TargetAssociations;
