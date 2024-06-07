import { getCoreRowModel, getExpandedRowModel, useReactTable } from "@tanstack/react-table";

// Deberia manejar la data tambien ?
// a
function RowInteractors(data = [], columns = []) {
  const interactorsTable = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });
  return <div>RowInteractors</div>;
}
export default RowInteractors;
