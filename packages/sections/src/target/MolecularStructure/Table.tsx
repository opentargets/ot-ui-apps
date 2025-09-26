import { OtTable, Link } from "ui";
import { naLabel } from "@ot/constants";
import { nanComparator } from "@ot/utils";
import { isAlphaFold } from "./helpers";

function Table({ uniprotId, rows, segments, setSelectedRow, request, query, variables }) {
  const columns = [
    {
      id: "id",
      label: "ID",
      sortable: true,
    },
    {
      id: "properties.method",
      label: "Method",
      sortable: true,
    },
    {
      id: "properties.resolution",
      label: "Resolution",
      sortable: true,
      numeric: true,
      filterValue: false,
      comparator: nanComparator(
        (a, b) => a - b,
        row => +row?.properties?.resolution?.replace(/\s*A/, ""),
        false
      ),
      renderCell: ({ properties: { resolution } }) => {
        return resolution != null ? resolution.replace("A", "Å") : naLabel;
      },
      exportValue: ({ properties: { resolution } }) => {
        return resolution?.replace("A", "Å");
      },
    },
    {
      id: "properties.chains",
      label: "Chain",
      filterValue: false,
      renderCell: ({ id }) => segments[id].chainsString,
      exportValue: ({ id }) => segments[id].chainsString,
    },
    {
      id: "positions",
      label: "Positions",
      sortable: true,
      comparator: (a, b) => {
        return segments?.[a?.id]?.maxLengthSegment - segments?.[b?.id]?.maxLengthSegment;
      },
      renderCell: ({ id }) => segments[id].segmentsString,
      exportValue: ({ id }) => segments[id].segmentsString,
    },
    {
      id: "properties.database",
      label: "Source",
      sortable: true,
      renderCell: ({ id, database }) => {
        const url = isAlphaFold({ database })
          ? `https://www.alphafold.ebi.ac.uk/entry/${uniprotId}`
          : `https://www.ebi.ac.uk/pdbe/entry/pdb/${id}`;
        return (
          <div onClick={event => event.stopPropagation()}>
            <Link external to={url}>
              {database}
            </Link>
          </div>
        );
      },
    },
  ];

  function getSelectedRows(selectedRows) {
    selectedRows.length > 0 && setSelectedRow(selectedRows[0]?.original);
  }

  return (
    <OtTable
      showGlobalFilter
      sortBy="positions"
      order="desc"
      columns={columns}
      loading={request.loading}
      rows={rows}
      getSelectedRows={getSelectedRows}
      query={query}
      variables={variables}
    />
  );
}

export default Table;
