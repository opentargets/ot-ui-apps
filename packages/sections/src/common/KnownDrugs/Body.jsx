import { useState, useEffect } from "react";

import { Link, Table, getPage, getComparator, useCursorBatchDownloader } from "ui";
import { naLabel, phaseMap } from "../../constants";
import { sentenceCase } from "../../utils/global";
import SourceDrawer from "./SourceDrawer";
import { SectionItem } from "ui";

function getColumnPool(id, entity) {
  return {
    clinicalTrials: {
      label: "Clinical trials information",
      columns: [
        {
          id: "phase",
          label: "Phase",
          sortable: true,
          renderCell: ({ phase }) => phaseMap(phase),
          filterValue: ({ phase }) => phaseMap(phase),
        },
        {
          id: "status",
          renderCell: d => (d.status ? d.status : naLabel),
        },
        {
          id: "sources",
          label: "Source",
          exportValue: d => d.urls.map(reference => reference.url),
          renderCell: d => <SourceDrawer references={d.urls} />,
        },
      ],
    },
    disease: {
      label: "Disease information",
      columns: [
        {
          id: "disease",
          propertyPath: "disease.id",
          renderCell: d => <Link to={`/disease/${d.disease.id}`}>{d.disease.name}</Link>,
        },
      ],
    },
    drug: {
      label: "Drug information",
      columns: [
        {
          id: "drug",
          propertyPath: "drug.id",
          renderCell: d =>
            d.drug ? <Link to={`/drug/${d.drug.id}`}>{d.drug.name}</Link> : naLabel,
        },
        {
          id: "type",
          propertyPath: "drugType",
          renderCell: d => d.drugType,
        },
        {
          id: "mechanismOfAction",
        },
        {
          id: "Action type",
          renderCell: ({ drug, target }) => {
            if (!drug?.mechanismsOfAction) return naLabel;
            const at = new Set();

            const targetId = entity === "target" ? id : target.id;

            drug.mechanismsOfAction.rows.forEach(row => {
              row.targets.forEach(t => {
                if (t.id === targetId) {
                  at.add(row.actionType);
                }
              });
            });

            const actionTypes = Array.from(at);

            return actionTypes.length > 0 ? (
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                }}
              >
                {actionTypes.map(actionType => (
                  <li key={actionType}>{sentenceCase(actionType)}</li>
                ))}
              </ul>
            ) : (
              naLabel
            );
          },
        },
      ],
    },
    target: {
      label: "Target information",
      columns: [
        {
          id: "targetSymbol",
          label: "Symbol",
          propertyPath: "target.approvedSymbol",
          renderCell: d => <Link to={`/target/${d.target.id}`}>{d.target.approvedSymbol}</Link>,
        },
        {
          id: "targetName",
          label: "Name",
          propertyPath: "target.approvedName",
          hidden: ["lgDown"],
          renderCell: d => d.target.approvedName,
        },
      ],
    },
  };
}

const INIT_PAGE_SIZE = 10;

function Body({
  definition,
  entity,
  variables,
  BODY_QUERY,
  Description,
  columnsToShow,
  stickyColumn,
  exportColumns,
  client,
}) {
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [cursor, setCursor] = useState("");
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(INIT_PAGE_SIZE);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const id = variables[Object.keys(variables)[0]];
  const columnPool = getColumnPool(id, entity);
  const columns = [];

  columnsToShow.forEach(columnGroupName => {
    columns.push(
      ...columnPool[columnGroupName].columns.map(column =>
        column.id === stickyColumn ? { ...column, sticky: true } : column
      )
    );
  });

  const headerGroups = [
    ...columnsToShow.map(columnGroupName => ({
      colspan: columnPool[columnGroupName].columns.length,
      label: columnPool[columnGroupName].label,
    })),
  ];

  const fetchDrugs = (newVariables, newCursor, size, freeTextQuery) =>
    client.query({
      query: BODY_QUERY,
      fetchPolicy: "no-cache",
      variables: {
        ...newVariables,
        cursor: newCursor,
        size,
        freeTextQuery,
      },
    });

  useEffect(
    () => {
      let isCurrent = true;

      fetchDrugs(variables, null, pageSize).then(res => {
        setInitialLoading(false);
        if (res.data[entity].knownDrugs && isCurrent) {
          const { cursor: newCursor, count: newCount, rows: newRows } = res.data[entity].knownDrugs;
          setCursor(newCursor);
          setCount(newCount);
          setRows(newRows);
        }
      });

      return () => {
        isCurrent = false;
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [variables]
  );

  const getWholeDataset = useCursorBatchDownloader(
    BODY_QUERY,
    { ...variables, freeTextQuery: globalFilter },
    `data[${entity}].knownDrugs`
  );

  const handlePageChange = newPage => {
    const numNewPageSize = parseInt(newPage, 10);
    if (pageSize * numNewPageSize + pageSize > rows.length && cursor !== null) {
      setLoading(true);
      fetchDrugs(variables, cursor, pageSize, globalFilter).then(res => {
        const { cursor: newCursor, rows: newRows } = res.data[entity].knownDrugs;
        setCursor(newCursor);
        setPage(numNewPageSize);
        setRows([...rows, ...newRows]);
        setLoading(false);
      });
    } else {
      setPage(numNewPageSize);
    }
  };

  const handleRowsPerPageChange = newPageSize => {
    const numNewPageSize = parseInt(newPageSize, 10);
    if (numNewPageSize > rows.length && cursor !== null) {
      setLoading(true);
      fetchDrugs(variables, cursor, numNewPageSize, globalFilter).then(res => {
        const { cursor: newCursor, rows: newRows } = res.data[entity].knownDrugs;
        setCursor(newCursor);
        setPage(0);
        setPageSize(numNewPageSize);
        setRows([...rows, ...newRows]);
        setLoading(false);
      });
    } else {
      setPage(0);
      setPageSize(numNewPageSize);
    }
  };

  const handleGlobalFilterChange = newGlobalFilter => {
    setLoading(true);
    fetchDrugs(variables, null, pageSize, newGlobalFilter).then(res => {
      const {
        cursor: newCursor,
        count: newCount,
        rows: newRows = [],
      } = res.data[entity].knownDrugs ?? {};
      setLoading(false);
      setPage(0);
      setCursor(newCursor);
      setCount(newCount);
      setGlobalFilter(newGlobalFilter);
      setRows(newRows);
    });
  };

  const handleSortBy = sortBy => {
    setSortColumn(sortBy);
    setSortOrder(
      // eslint-disable-next-line
      sortColumn === sortBy ? (sortOrder === "asc" ? "desc" : "asc") : "asc"
    );
  };
  const processedRows = [...rows];

  if (sortColumn) {
    processedRows.sort(getComparator(columns, sortOrder, sortColumn));
  }

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={{
        loading: initialLoading,
        error: false,
        data: {
          [entity]: {
            knownDrugs: {
              rows,
              count: rows.length,
              freeTextQuery: globalFilter,
            },
          },
        },
      }}
      renderDescription={Description}
      renderBody={() => (
        <Table
          loading={loading}
          stickyHeader
          showGlobalFilter
          globalFilter={globalFilter}
          dataDownloader
          dataDownloaderRows={getWholeDataset}
          dataDownloaderFileStem={`${id}-known-drugs`}
          headerGroups={headerGroups}
          columns={columns}
          rows={getPage(processedRows, page, pageSize)}
          rowCount={count}
          rowsPerPageOptions={[10, 25, 100]}
          page={page}
          pageSize={pageSize}
          onGlobalFilterChange={handleGlobalFilterChange}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onSortBy={handleSortBy}
          dataDownloaderColumns={exportColumns}
          query={BODY_QUERY.loc.source.body}
          variables={variables}
        />
      )}
    />
  );
}

export default Body;
