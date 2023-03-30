import { useQuery } from "@apollo/client";

function useTableQueryData(TABLE_DATA_QUERY, QUERY_VARIABLES, pageSize) {
  const [tableData, setTableData] = useState([]);
  const [tableDataLoading, setTableDataLoading] = useState([]);
  const [cursor, setCursor] = React.useState(null);

  const { loading, data } = useQuery(TABLE_DATA_QUERY, {
    variables: { ...QUERY_VARIABLES, size: pageSize, cursor: cursor },
  });

  useEffect(() => {
    setTableData(data);
    setTableDataLoading(loading);
    // setCursor(data)
  }, [loading, data]);

  return [tableData, tableDataLoading];
}

export default useTableQueryData;
