import { useState, useEffect, useMemo } from "react";

import OtTableSSP from "./OtTableSSP";

const INIT_PAGE_SIZE = 10;

function OtTableWrapper({ query, columns, client, entity, variables, showGlobalFilter }) {
  const [loading, setLoading] = useState(false);

  const tableDataObject = {
    count: 0,
    cursor: null,
    rows: [],
  };

  const [tableObjectState, setTableObjectState] = useState(tableDataObject);

  function fetcher(variables, cursor, size, freeTextQuery, pageSizeChanged) {
    return client.query({
      query,
      variables: {
        ...variables,
        cursor: !(freeTextQuery || pageSizeChanged) ? cursor : null,
        size: size, // fetch 10 pages ahead of time
        freeTextQuery,
      },
    });
  }

  function getTableData({ searchQuery = null, pageSize }) {
    console.log("getTableData -> pageSize", pageSize, !!pageSize);
    setLoading(true);
    fetcher(variables, tableObjectState.cursor, pageSize, searchQuery, !!pageSize)
      .then(res => assignDataValues(res, searchQuery))
      .catch(() => {
        const newTableState = {
          count: 0,
          cursor: null,
          rows: [],
        };
        setTableObjectState(newTableState);
        setLoading(false);
      });
  }

  function assignDataValues(res, searchQuery) {
    const { cursor, count, rows } = res.data[entity].knownDrugs;
    let ALL_ROWS = [];
    if (searchQuery) ALL_ROWS = [...rows];
    else ALL_ROWS = [...tableObjectState.rows, ...rows];

    const newTableState = {
      ...tableObjectState,
      count,
      cursor,
      rows: ALL_ROWS,
    };
    setTableObjectState(newTableState);
    setLoading(false);
  }

  // useEffect(
  //   () => {
  //     getTableData();
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   []
  // );

  return (
    <OtTableSSP
      showGlobalFilter
      tableDataLoading={loading}
      allColumns={columns}
      allData={tableObjectState.rows}
      count={tableObjectState.count}
      getMoreData={getTableData}
      verticalHeaders={false}
    />
  );
}

export default OtTableWrapper;
