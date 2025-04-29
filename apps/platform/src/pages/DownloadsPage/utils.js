export const mapFile = url => {
  let format = "";
  const fileNameParts = url.split(".");

  if (fileNameParts[fileNameParts.length - 1].toLowerCase() === "gz") {
    fileNameParts.pop();
    format = "GZipped";
  }

  return [format, fileNameParts.pop().toUpperCase()].join(" ");
};

// export const mapIcon = name =>
// <FontAwesomeIcon
//   icon={
//     {
//       "Target list": faDna,
//       "Disease list": faStethoscope,
//     }[name] || faArchive
//   }
// />

export const buildSchema = (obj, delimiter = "") => {
  let schema = "";
  let descriptionArray = [];
  const DIVIDER = `\n${delimiter}│⎯`;
  const FIELD = getFieldProperty(obj);
  for (const column of obj[FIELD]) {
    const isPrimaryKey = isPrimaryColumn(column, obj.key);
    const dataType = getDataType(column);
    schema += `${DIVIDER}${column.name}${dataType}`;
    const descObj = { id: column["@id"], name: column.name, description: column.description };
    descriptionArray.push(descObj);
    if (dataType.includes("Struct")) {
      const { schema: nestedSchema, descriptionArray: nestedDescriptionArray } = buildSchema(
        column,
        `${delimiter}│⎯`
      );
      schema += nestedSchema;
      descriptionArray = [...descriptionArray, ...nestedDescriptionArray];
    }
    if (isPrimaryKey) schema += `(primary key)`;
    if (isForeignColumn(column)) schema += `(foreign key)`;
  }
  return { schema, descriptionArray };
};

export const isPrimaryColumn = (column, primaryKeyObj = []) => {
  if (!primaryKeyObj.length) return false;
  return primaryKeyObj.some(e => e["@id"] === column["@id"]);
};

export const isForeignColumn = column => {
  if (Object.hasOwn(column, "references")) {
    return column["references"]["field"]["@id"];
  }
  return false;
};

export const getDataType = column => {
  let dataType = "";
  const primitiveType = isPrimitive(column);
  const structType = isStruct(column);
  if (isTypeArray(column)) {
    dataType += " []";
  }
  if (primitiveType) {
    dataType += ` <${primitiveType}>`;
  }
  if (structType) {
    dataType += ` <${structType}>`;
  }
  if (!dataType) return "<Unknown>";
  return dataType;
};

export const isTypeArray = column => {
  return Object.hasOwn(column, "repeated") && column.repeated;
};

export const isPrimitive = column => {
  if (Object.hasOwn(column, "dataType")) {
    const primitiveType = column.dataType.split(":");
    return primitiveType[1];
  }
  return false;
};

export const isStruct = column => {
  if (Object.hasOwn(column, "subField")) {
    return "Struct";
  }
  return false;
};

export const getFieldProperty = column => {
  if (Object.hasOwn(column, "subField")) {
    return "subField";
  }
  if (Object.hasOwn(column, "field")) {
    return "field";
  }
  return;
};

export const addCategoriesToData = data => {
  const results = new Set();

  data.map(item => {
    const categories = item.description.match(/\[(.*?)\]/);
    if (categories) {
      item.categories = [...categories[1].split(",")];
      return results.add(...categories[1].split(","));
    }
    return;
  });

  return { allDisplayRows: data, allUniqueCategories: [...results] };
};

export function getAllRows(data) {
  if (!data) return [];
  return data.distribution.filter(e => e["@type"] === "cr:FileSet");
}

export function getSchemaRows(data) {
  if (!data) return [];
  return data.recordSet;
}

// export const getCategoryFromRow = desc => {
//   const categories = desc.match(/\[(.*?)\]/);
//   if (categories) return categories[1].split(",");
//   return;
// };
