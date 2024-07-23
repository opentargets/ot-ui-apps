import { DefaultSortProp } from "./table.types";

/*********************************************************************
 * FN TO CONVERT CLASSIC MUI TABLE COLUMNS TO TANSTACK TABLE COLUMNS *
 *********************************************************************/
export function mapTableColumnToTanstackColumns(allColumns: any[]): any[] {
  return allColumns.map(column => mapToTanstackColumnObject(column));
}

// TO BE USED WHEN WANT TO USE MULTIPLE VALUE IN COLUMN FOR FILTERING
// if disease object has id and name, and want to enable search for both of them
// example(in column object): TODO: figure out a way to call this

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
    if (typeof ob[i] === "object" && !Array.isArray(ob[i])) {
      const temp = flattenObj(ob[i]);
      for (const j in temp) result[i + "." + j] = temp[j];
    } else result[i] = ob[i];
  }
  return result;
}

/****************************************************************************
 * FN TO MAP EACH KEY FROM CLASSIC MUI COLUMN OBJECT TO NEW TANSTACK COLUMN *
 ****************************************************************************/
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
       * ASSIGN EITHER CUSTOM FILTERVALUE OR ID
       **************************************************************/
      if (originalTableObject.filterValue) return originalTableObject.filterValue(row);
      return getValueFromChainedId(originalTableObject.id, row);
    },
    cell: ({ row }: { row: Record<string, unknown> }) => {
      /**************************************************************
       * ASSIGN CELL EITHER CUSTOM RENDER CELL OR ID*
       **************************************************************/
      if (originalTableObject.renderCell) return originalTableObject.renderCell(row.original);
      return getValueFromChainedId(originalTableObject.id, row.original);
    },
    filterFn: "equalsString",
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
