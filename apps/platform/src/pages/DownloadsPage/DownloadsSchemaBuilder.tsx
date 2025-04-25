import { faKey, faNetworkWired } from "@fortawesome/free-solid-svg-icons";
import { Box } from "@mui/material";
import { Tooltip } from "ui";
import { FontAwesomeIconPadded } from "ui/src/components/OtTable/otTableLayout";
import { getDataType, getFieldProperty, isForeignColumn, isPrimaryColumn } from "./utils";

function DownloadsSchemaBuilder({ data }) {
  const { schema } = buildSchema(data);
  return <div>{schema}</div>;
}

function buildSchema(obj, delimiter = "") {
  let schema = <></>;
  let descriptionArray = [];

  const DIVIDER = `${delimiter}│⎯`;
  const FIELD = getFieldProperty(obj);
  for (const column of obj[FIELD]) {
    let currentElement;
    const dataType = getDataType(column);
    const isPrimaryKey = isPrimaryColumn(column, obj.key);
    const isForeignKey = isForeignColumn(column);
    const descObj = {
      id: column["@id"],
      name: column.name,
      description: column.description,
      isPrimaryKey: isPrimaryKey,
      isForeignKey: isForeignKey,
    };
    descriptionArray.push(descObj);
    currentElement = (
      <Box sx={{ color: "black" }}>
        {DIVIDER}
        {column.name}
        {dataType} <PrimaryKeyIcon isPrimaryKey={isPrimaryKey} />{" "}
        <ForeignKeyIcon isForeignKey={isForeignKey} />
      </Box>
    );
    if (dataType.includes("Struct")) {
      const { schema: nestedSchema, descriptionArray: nestedDescriptionArray } = buildSchema(
        column,
        `${delimiter}│⎯`
      );
      descriptionArray = [...descriptionArray, ...nestedDescriptionArray];
      currentElement = (
        <div>
          {currentElement}
          <div>{nestedSchema}</div>
        </div>
      );
    }
    schema = (
      <>
        {schema}
        {currentElement}
      </>
    );
  }
  return { schema, descriptionArray };
}

function PrimaryKeyIcon({ isPrimaryKey }) {
  if (!isPrimaryKey) return;
  return (
    <Tooltip title="Primary Key">
      <FontAwesomeIconPadded sx={{ color: theme => theme.palette.primary.main }} icon={faKey} />
    </Tooltip>
  );
}

function ForeignKeyIcon({ isForeignKey }) {
  if (!isForeignKey) return;
  return (
    <Tooltip title={`Foreign Key: ${isForeignKey}`}>
      <FontAwesomeIconPadded
        sx={{ color: theme => theme.palette.primary.light }}
        icon={faNetworkWired}
      />
    </Tooltip>
  );
}

export default DownloadsSchemaBuilder;
