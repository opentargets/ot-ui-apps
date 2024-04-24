import { useState, useEffect } from "react";

import {
  Link,
  Table,
  getPage,
  getComparator,
  useCursorBatchDownloader,
  OtTable,
  OtTableSSP,
} from "ui";
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
          renderCell: ({ drug: { mechanismsOfAction }, target }) => {
            if (!mechanismsOfAction) return naLabel;
            const at = new Set();

            const targetId = entity === "target" ? id : target.id;

            mechanismsOfAction.rows.forEach(row => {
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

function getOtTableColumns() {
  return [
    {
      header: "Disease Information",
      columns: [
        {
          header: "Disease",
          accessorFn: row => row.disease.id,
          cell: d => (
            <Link to={`/disease/${d.row.original.disease.id}`}>{d.row.original.disease.name}</Link>
          ),
          enableSorting: false,
          enableColumnFilter: false,
        },
      ],
    },
    {
      header: "Drug Information",
      columns: [
        {
          header: "Drug",
          accessorKey: "drug.name",
          cell: ({ row }) =>
            row.original.drug ? (
              <Link to={`/drug/${row.original.drug.id}`}>{row.original.drug.name}</Link>
            ) : (
              naLabel
            ),
          enableSorting: false,
          enableColumnFilter: false,
          sticky: true,
        },
        {
          header: "Type",
          accessorKey: "drugType",
          enableSorting: false,
          enableColumnFilter: false,
        },
        {
          header: "Mechanism Of Action",
          accessorKey: "mechanismOfAction",
          enableSorting: false,
          enableColumnFilter: false,
        },
        {
          header: "Action Type",
          id: "actionType",
          accessorFn: row => row.drug?.mechanismsOfAction?.rows[0]?.actionType,
          enableSorting: false,
          enableColumnFilter: false,
        },
      ],
    },
    {
      header: "Target Information",
      columns: [
        {
          header: "Symbol",
          accessorKey: "target.approvedSymbol",
          cell: d => (
            <Link to={`/target/${d.row.original.target.id}`}>
              {d.row.original.target.approvedSymbol}
            </Link>
          ),
          enableSorting: false,
          enableColumnFilter: false,
        },
      ],
    },
    {
      header: "Clinical Trials Information",
      columns: [
        {
          header: "Name",
          accessorKey: "target.approvedName",
          enableSorting: false,
          enableColumnFilter: false,
        },
        {
          header: "Phase",
          accessorKey: "phase",
          cell: info => phaseMap(info.getValue()),
          enableSorting: true,
          enableColumnFilter: false,
        },
        {
          header: "Status",
          accessorKey: "status",
          // cell: d => d.row.original.status,
        },
      ],
    },
    {
      accessorKey: "sources",
      header: "Source",
      cell: d => <SourceDrawer references={d.row.original.urls} />,
      enableSorting: false,
      enableColumnFilter: false,
    },
  ];
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
  const [loading, setLoading] = useState(true);
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
        setLoading(false);
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
    <>
      <h2>origional table:</h2>
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
      <h2>tanstack table client side :</h2>

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
          <OtTable
            showGlobalFilter={true}
            tableDataLoading={loading}
            columns={getOtTableColumns()}
            dataRows={rows}
          />
        )}
      />

      <h2>tanstack table server side :</h2>

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
          // <OtTable
          //   showGlobalFilter={true}
          //   tableDataLoading={loading}
          //   allColumns={getOtTableColumns()}
          //   allData={rows}
          // />

          // <OtTableWrapper
          //   showGlobalFilter
          //   columns={getOtTableColumns()}
          //   query={BODY_QUERY}
          //   variables={variables}
          //   entity={entity}
          //   client={client}
          // />

          <OtTableSSP
            showGlobalFilter
            columns={getOtTableColumns()}
            verticalHeaders={false}
            query={BODY_QUERY}
            variables={variables}
            entity={entity}
            client={client}
            sectionName="knownDrugs"
          />

          // <>ddd</>
        )}
      />
    </>
  );
}

export default Body;
