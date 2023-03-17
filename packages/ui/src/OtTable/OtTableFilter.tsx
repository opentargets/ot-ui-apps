import React from "react";
import { Column } from "@tanstack/react-table";

function OtTableFilter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue();

  return (
    <>
      <input
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(e) => column.setFilterValue(e.target.value)}
        placeholder={`Search..`}
        list={column.id + "list"}
      />
      <div className="h-1" />
    </>
  );
}

export default OtTableFilter;
