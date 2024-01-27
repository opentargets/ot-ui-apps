import { useState } from "react";
import { Box, Drawer, IconButton, Snackbar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";
import { Tooltip } from "ui";

const useStyles = makeStyles(theme => ({
  backdrop: {
    "& .MuiBackdrop-root": {
      opacity: "0 !important",
    },
  },
  children: {
    display: "flex",
    justifyContent: "center",
  },
  clipboard: {
    position: "absolute !important",
    top: "0",
    right: "0",
    padding: "0.4em 0.5em !important",
  },
  closeButton: {
    zIndex: "2",
    position: "fixed",
    top: 0,
    right: 0,
    padding: "0.7em",
  },
  codeBlock: {
    backgroundColor: theme.palette.grey[300],
    padding: "0.2em 6em 0.2em 0.2em",
    fontSize: "0.9em",
    position: "relative",
  },
  title: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderBottom: "1px solid #ccc",
    fontSize: "1.2rem",
    fontWeight: "bold",
    padding: "1rem",
    position: "fixed",
    width: "100%",
    zIndex: "1",
  },
  schemaContainer: {
    padding: "5em 2em",
  },
}));

function DownloadsSchemaDrawer({ title, children, serialisedSchema = {} }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const LAST_ELEMENT_IN_SCHEMA_STRING = "└───";
  const NON_LAST_ELEMENT_IN_SCHEMA_STRING = "├───";
  const NEXT_LINE_STRING = "\n";

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  function convertSimpleObjectToSchema(obj, isLastElement) {
    const schemaString = isLastElement
      ? LAST_ELEMENT_IN_SCHEMA_STRING
      : NON_LAST_ELEMENT_IN_SCHEMA_STRING;
    return `${NEXT_LINE_STRING}${schemaString}${obj.name} : ${obj.type}`;
  }

  function convertArrayObjectToSchema(obj, isLastElement) {
    const schemaString = isLastElement
      ? LAST_ELEMENT_IN_SCHEMA_STRING
      : NON_LAST_ELEMENT_IN_SCHEMA_STRING;

    const elementType =
      typeof obj.type.elementType === "object" ? "struct" : typeof obj.type.elementType;

    let schema = `${NEXT_LINE_STRING}${schemaString}${obj.name}: array `;

    if (elementType === "struct") {
      const childSchema = convertStructObjectToSchema(obj.type.elementType, false);
      schema = `${schema}${childSchema}`;
    } else {
      schema = `${schema}${NEXT_LINE_STRING}│   ${NON_LAST_ELEMENT_IN_SCHEMA_STRING}element: ${elementType} `;
    }

    return schema;
  }

  function convertStructObjectToSchema(obj, isLastElement) {
    const schemaString = isLastElement
      ? LAST_ELEMENT_IN_SCHEMA_STRING
      : NON_LAST_ELEMENT_IN_SCHEMA_STRING;

    let schema = obj.type.fields
      ? `${NEXT_LINE_STRING}${schemaString}${obj.name}: array ${NEXT_LINE_STRING}│   ${NON_LAST_ELEMENT_IN_SCHEMA_STRING}element: struct`
      : `${NEXT_LINE_STRING}│   ${schemaString}element: struct `;

    const fields = obj.type.fields || obj.fields;
    if (fields)
      fields.forEach(element => {
        const childSchemaFn = getType(element);
        schema = `${schema}${childSchemaFn(element, false).replaceAll(/\n/g, "\n│   │   ")}`;
      });
    return schema;
  }

  function convertMapObjectToSchema(obj, isLastElement) {
    const schemaString = isLastElement
      ? LAST_ELEMENT_IN_SCHEMA_STRING
      : NON_LAST_ELEMENT_IN_SCHEMA_STRING;

    const schemaFn = getType({
      type: {
        type: obj.type.valueType,
      },
    });

    const schemaObj = { name: "value", type: { ...obj.type.valueType } };

    let schema = `${NEXT_LINE_STRING}${schemaString}${
      obj.name
    }: map${NEXT_LINE_STRING}│   ${NON_LAST_ELEMENT_IN_SCHEMA_STRING}key: ${
      obj.type.keyType
    } ${schemaFn(schemaObj).replaceAll(/\n/g, "\n│   ")}`;

    return schema;
  }

  function getType(obj) {
    if (typeof obj !== "object") return null;

    if (typeof obj.type === "string") return convertSimpleObjectToSchema;

    switch (obj.type.type) {
      case "array":
        return convertArrayObjectToSchema;
      case "struct":
        return convertStructObjectToSchema;
      case "map":
        return convertMapObjectToSchema;
      default:
        return getType(obj.type);
    }
  }

  function jsonToSchema(rawObj) {
    let schemaObjString = "";
    if (isEmpty(rawObj)) schemaObjString = `${schemaObjString} ${typeof rawObj}`;

    if (Array.isArray(rawObj)) {
      rawObj.forEach(element => {
        const childSchema = jsonToSchema(element);
        schemaObjString = `${schemaObjString}${childSchema}`;
      });
    } else if (typeof rawObj === "object") {
      const fnType = getType(rawObj);
      const childSchema = fnType(rawObj, false);
      schemaObjString = `${schemaObjString}${childSchema}`;
    }

    return schemaObjString.replaceAll(/\n/g, "\n   ");
  }

  function toggleOpen() {
    setOpen(!open);
  }

  function close() {
    setOpen(false);
  }

  function handleCloseSnackbar() {
    setSnackbarOpen(false);
  }

  function copyToClipboard() {
    setSnackbarOpen(true);
    navigator.clipboard.writeText(JSON.stringify(serialisedSchema));
  }

  return (
    <>
      <span className={classes.children} onClick={() => toggleOpen()}>
        {children}
      </span>
      <Drawer
        classes={{ root: classes.backdrop }}
        open={open}
        onClose={() => close()}
        anchor="right"
      >
        <Box>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
          <IconButton className={classes.closeButton} onClick={() => close()}>
            <FontAwesomeIcon icon={faXmark} className={classes.closeButton} />
          </IconButton>
        </Box>
        <div className={classes.schemaContainer}>
          <Typography variant="h6" gutterBottom>
            Schema Format
          </Typography>

          <div className={classes.codeBlock}>
            <Tooltip title="Copy JSON to clipboard">
              <IconButton className={classes.clipboard} onClick={() => copyToClipboard()}>
                <FontAwesomeIcon icon={faClipboard} />
              </IconButton>
            </Tooltip>
            <pre>
              <code>{`   root${
                serialisedSchema.fields && jsonToSchema(serialisedSchema.fields)
              }`}</code>
            </pre>
          </div>
        </div>
      </Drawer>
      <Snackbar
        open={snackbarOpen}
        onClose={() => handleCloseSnackbar()}
        message="Schema copied"
        autoHideDuration={3000}
      />
    </>
  );
}

export default DownloadsSchemaDrawer;
