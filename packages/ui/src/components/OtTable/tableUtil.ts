import { DefaultSortProp } from "./table.types";

/*********************************************************************
 * FN TO CONVERT CLASSIC MUI TABLE COLUMNS TO TANSTACK TABLE COLUMNS *
 *********************************************************************/
export function mapTableColumnToTanstackColumns(
  allColumns: Record<string, unknown>[]
): Record<string, unknown>[] {
  return allColumns.map(column => mapToTanstackColumnObject(column));
}

/******************************************************
 * FLATTENS THE OBJECT RETURNS THE VALUES AS A STRING *
 * @param: object 
 * const ob = {
    disease: {
        name: "cancer"
        id: "MONDO_0004992"
    }
  };
  @example: getFilterValueFromObject(ob)
  @return: 'cancer MONDO_0004992'
 ******************************************************/
export function getFilterValueFromObject(obj: Record<string, unknown>): string {
  const flatObj = flattenObj(obj);
  return Object.values(flatObj).join(" ");
}

/**********************************************************
 * FN TO RETURN SORT OBJECT REQUIRED BY TANSTACK TABLE STATE *
 * @param:
 *  sortBy: type string
 *  order: type string
 * @example: getDefaultSortObj("pValue", "asc")
 * @return: { id: "pValue", desc: false}: type DefaultSortProp
 **********************************************************/
export function getDefaultSortObj(sortBy: string, order: string): DefaultSortProp {
  return {
    id: sortBy,
    desc: order === "desc",
  };
}

/*****************************************************
 * CONVERT THE NESTED OBJECT TO FLAT OBJECT *
 * @param: object 
 *  const ob = {
      disease: {
          name: "cancer"
      }
    };
  @example: flattenObj(ob)
  @return: { 'disease.name': 'cancer' }
 *****************************************************/
export function flattenObj(ob: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const i in ob) {
    if (typeof ob[i] === "object") {
      const temp = flattenObj(ob[i]);
      for (const j in temp) result[i + "." + j] = temp[j];
    } else result[i] = ob[i];
  }
  return result;
}

/**********************************************************************
 * CALCULATE POSITION OF CURRENT PAGE AS PER PAGE SIZE AND TOTAL ROWS *
 * @param:
 *  pageIndex : number
 *  pageSize : number
 *  totalRows : number
 * @return: string
 *  EXAMPLE 1: 31-40 OF 45
 *  EXAMPLE 2: 41-45 OF 45
 **********************************************************************/

export function getCurrentPagePosition(
  pageIndex: number,
  pageSize: number,
  totalRows: number
): string {
  const currentPageStartRange = pageIndex * pageSize + 1;
  const currentPageEndRange = pageIndex * pageSize + pageSize;
  const pageEndResultSize = Math.min(currentPageEndRange, totalRows);

  return `${currentPageStartRange} - ${pageEndResultSize} of ${totalRows}`;
}

/****************************************************************************
 * FN TO MAP EACH KEY FROM CLASSIC MUI COLUMN OBJECT TO NEW TANSTACK COLUMN *
 ****************************************************************************/
function mapToTanstackColumnObject(
  originalTableObject: Record<string, unknown>
): Record<string, unknown> {
  const newTanstackObject: Record<string, unknown> = {
    id: originalTableObject.id,
    header: originalTableObject.label,
    enableSorting: originalTableObject.sortable || false,
    enableColumnFilter: originalTableObject.enableColumnFilter || false,
    filterFn: "equalsString",
    ...(originalTableObject.comparator && {
      sortingFn: (rowA, rowB, column) =>
        originalTableObject.comparator(rowA.original, rowB.original),
    }),
    //  ASSIGN EITHER CUSTOM FILTERVALUE OR ID
    accessorFn: (row: Record<string, unknown>) => {
      if (originalTableObject.filterValue) return originalTableObject.filterValue(row);
      return getValueFromChainedId(originalTableObject.id, row);
    },
    //  ASSIGN CELL EITHER CUSTOM RENDER CELL OR ID
    cell: ({ row }: { row: Record<string, unknown> }) => {
      if (originalTableObject.renderCell) return originalTableObject.renderCell(row.original);
      return getValueFromChainedId(originalTableObject.id, row.original);
    },
    ...originalTableObject,
  };
  return { ...newTanstackObject };
}

/***********************************************
 * EXTRACT OBJECT VALUE FROM STRING IDENTIFIER *
 * @params :
 *  id: type string
 *  obj: type object
 * @example : getValueFromChainedId("disease.name", {disease: { "name": "cancer"}})*
 * @return: cancer
 ***********************************************/
function getValueFromChainedId(id: string, obj: Record<string, unknown>) {
  const accessorKeys = id.split(".");
  const filterValue = accessorKeys.reduce(
    (accumulator, currentValue) => accumulator[currentValue],
    obj
  );
  return filterValue;
}
