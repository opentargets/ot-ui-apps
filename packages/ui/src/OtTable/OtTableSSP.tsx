import { useEffect, useState } from "react";

const INIT_PAGE_SIZE = 10;

type OtTableSSPProps = {
  query: string;
  columns: Array<object>;
  client;
  entity: string;
  variables;
  showGlobalFilter: Boolean;
};
function OtTableSSP({
  query,
  columns,
  client,
  entity,
  variables,
  showGlobalFilter,
}: OtTableSSPProps) {
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [cursor, setCursor] = useState(null);
  const [rows, setRows] = useState<any[]>([]);

  const fetcher = (variables, cursor, size, freeTextQuery) => {
    return client.query({
      query,
      variables: {
        ...variables,
        cursor: !freeTextQuery ? cursor : null,
        size: size * 10, // fetch 10 pages ahead of time
        freeTextQuery,
      },
    });
  };

  const getMoreData = (searchQuery = null) => {
    setLoading(true);
    fetcher(variables, cursor, INIT_PAGE_SIZE, searchQuery)
      .then(assignDataValues)
      .catch(() => {
        setInitialLoading(false);
        setLoading(false);
        setCursor(null);
        // setCount(1);
        setRows([]);
      });
  };

  const assignDataValues = (res) => {
    //TODO
    const {
      cursor: newCursor,
      count: newCount,
      rows: newRows,
    } = res.data[entity].knownDrugs;
    const ALL_ROWS = [...rows, ...newRows];
    setInitialLoading(false);
    setLoading(false);
    setCursor(newCursor);
    setCount(newCount);
    setRows(ALL_ROWS);
  };

  useEffect(
    () => {
      setInitialLoading(true);
      fetcher(variables, null, INIT_PAGE_SIZE, null).then(assignDataValues);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return <div>OtTableSSP</div>;
}

export default OtTableSSP;
