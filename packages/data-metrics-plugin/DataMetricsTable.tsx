import React from "react";
import { OtTable } from "ui";
import { DataMetricsTableProps, Row} from "./types";

function DataMetricsTable({ metrics, prevMetrics, variables, sources }: DataMetricsTableProps) {
  // Define columns for OtTable
  const columns = [
    {
      id: "datasource",
      label: "Datasource",
      enableHiding: false,
      renderCell: (row: Row) => row.datasource.display,
      exportLabel: "Datasource",
      propertyPath: "datasource.value",
    },
    ...variables.map((variable) => ({
      id: variable,
      label: variable,
      align: "right",
      renderCell: (row: Row) => row[variable].display,
      exportLabel: variable,
      propertyPath: `${variable}.value`,
    })),
  ];

  // Prepare rows for OtTable
  const rows: Row[] = Array.from(sources)
    .sort()
    .map((ds) => {
      const row: Row = {
        datasource: {
          display: ds,
          value: ds,
        },
      };
      for (const variable of variables) {
        const metric = metrics.find((m) => m.datasourceId === ds && m.variable === variable);
        const prevMetric = prevMetrics.find(
          (pm) => pm.datasourceId === ds && pm.variable === variable
        );
        if (metric || prevMetric) {
          const currValue = metric ? Number(metric.value) : 0;
          const prevValue = prevMetric ? Number(prevMetric.value) : 0;
          const diff = currValue - prevValue;
          const pct = prevValue !== 0 ? (diff / prevValue) * 100 : null;
          let display: React.ReactNode = currValue.toLocaleString();
          if (prevMetric) {
            display = (
              <span>
                {currValue.toLocaleString()}{" "}
                <span
                  style={{
                    color: diff > 0 ? "green" : diff < 0 ? "red" : undefined,
                    fontSize: "0.9em",
                  }}
                >
                  {diff > 0 ? "▲" : diff < 0 ? "▼" : ""}{" "}
                  {diff !== 0 ? Math.abs(diff).toLocaleString() : ""}{" "}
                  {pct !== null ? `(${pct.toFixed(1)}%)` : ""}
                </span>
              </span>
            );
          }
          row[variable] = {
            display,
            value: currValue.toString(),
          };
        } else {
          row[variable] = {
            display: "-",
            value: "-",
          };
        }
      }
      return row;
    });

  return (
    <OtTable
      showGlobalFilter={false} // This would require some refactoring to work well. The filter function in OtTable assumes a single value per cell, not an object with display and value. Just using a object would not work because the object is JSX (instead of a value) and cannot be searched.
      columns={columns}
      rows={rows}
      dataDownloaderFileStem={"data-metrics-table"}
      tableDataLoading={false}
      verticalHeaders={false}
      order={"desc"}
      sortBy={""}
      defaultSortObj={undefined}
      dataDownloader={false}
      query={null as any}
      variables={{}}
      showColumnVisibilityControl={false}
      loading={false}
      enableMultipleRowSelection={false}
      getSelectedRows={null as any}
    />
  );
}

export default DataMetricsTable;
