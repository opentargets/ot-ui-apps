import { DefaultSortProp } from "./table.types";

/*********************************************************************
 * FN TO CONVERT CLASSIC MUI TABLE COLUMNS TO TANSTACK TABLE COLUMNS *
 *********************************************************************/
export function mapTableColumnToTanstackColumns(allColumns: any[]): any[] {
  return allColumns.map(column => mapToTanstackColumnObject(column));
}

/******************************************************
 * FLATTENS THE OBJECT RETURNS THE VALUES AS A STRING *
 ******************************************************/
export function getFilterValueFromObject(obj: Record<string, unknown>): string {
  const flatObj = flattenObj(obj);
  return Object.values(flatObj).join(" ");
}

/**********************************************************
 * FN TO RETURN SORT OBJ EXPECTED BY TANSTACK TABLE STATE *
 **********************************************************/
export function getDefaultSortObj(sortBy: string, order: string): DefaultSortProp {
  return {
    id: sortBy,
    desc: order === "desc",
  };
}

/*****************************************************
 * FLATTEN THE NESTED OBJECT FOR BETTER FILTER VALUE *
 * Example @param object 
 * let ob = {
    disease: {
        name: "cancer"
    }
  };
  OUTPUT: 
  {
  'disease.name': 'cancer'
  }
 *****************************************************/

export function flattenObj(ob: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const i in ob) {
    if (typeof ob[i] === "object" && !Array.isArray(ob[i])) {
      const temp = flattenObj(ob[i]);
      for (const j in temp) result[i + "." + j] = temp[j];
    } else result[i] = ob[i];
  }
  return result;
}

/******************************************************************
 * FN TO MAP EACH KEY FROM CLASSIC COLUMN FOR NEW TANSTACK COLUMN *
 ******************************************************************/
function mapToTanstackColumnObject(
  originalTableObject: Record<string, unknown>
): Record<string, unknown> {
  const newTanstackObject = {
    id: originalTableObject.id,
    header: originalTableObject.label,
    enableSorting: originalTableObject.sortable || false,
    enableColumnFilter: originalTableObject.enableColumnFilter || false,
    accessorFn: (row: Record<string, unknown>) => {
      /**************************************************************
       * ASSIGN ACCESSORFN EITHER FILTERVALUE
       * EX: CUSTOM FN ADDED TO COLUMN
       * OR
       * OBJECT ID CHAINNED
       * EX: disease.name into row["disease"]["name"] *
       **************************************************************/
      if (originalTableObject.filterValue) return originalTableObject.filterValue(row);
      const accessorKeys = originalTableObject.id.split(".");
      const filterValue = accessorKeys.reduce(
        (lastValue, currentValue) => lastValue[currentValue],
        row
      );
      return filterValue;
    },
    cell: ({ row }: { row: Record<string, unknown> }) => {
      /**************************************************************
       * ASSIGN CELL EITHER RENDERCELL
       * EX: CUSTOM RENDERCELL ADDED TO COLUMN
       * OR
       * OBJECT ID CHAINNED
       * EX: disease.name into row["disease"]["name"] *
       **************************************************************/
      if (originalTableObject.renderCell) return originalTableObject.renderCell(row.original);
      const accessorKeys = originalTableObject.id.split(".");
      const filterValue = accessorKeys.reduce(
        (lastValue, currentValue) => lastValue[currentValue],
        row
      );
      return filterValue;
    },
    ...originalTableObject,
  };
  return { ...newTanstackObject };
}

// missing keys from column data obj
/************
 *  WIDTH *
 * filter value - ? check
 * exportValue
 * tooltip
 * minWidth
 * numeric
 ************/
