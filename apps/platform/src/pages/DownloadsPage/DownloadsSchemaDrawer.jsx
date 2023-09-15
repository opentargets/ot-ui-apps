import { useState } from 'react';
import { Drawer, IconButton, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const useStyles = makeStyles(theme => ({
  backdrop: {
    '& .MuiBackdrop-root': {
      opacity: '0 !important',
    },
  },
  children: {
    display: 'flex',
    justifyContent: 'center',
  },
  codeBlock: {
    backgroundColor: theme.palette.grey[300],
    padding: '0.2em 2em 0.2em 0.2em',
    fontSize: '0.85em',
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderBottom: '1px solid #ccc',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    padding: '1rem',
  },
  paper: {
    width: '420px',
    margin: '1.5rem',
    padding: '1rem',
  },
  resourceURL: {
    marginBottom: '8px',
    padding: '10px',
    wordBreak: 'break-all',
    backgroundColor: theme.palette.grey[800],
    color: 'white',
  },
  ftpURL: {
    color: 'white',
    textDecoration: 'none',
  },
  schemaContainer: {
    padding: '2em',
  },
}));

function DownloadsSchemaDrawer({ title, children, serialisedSchema = {} }) {
  console.log(
    `👻 ~ file: DownloadsSchemaDrawer.jsx:54 ~ DownloadsSchemaDrawer ~ serialisedSchema:`,
    serialisedSchema
  );
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  function isLastElementInObject(obj, key) {
    if (Object.keys(obj)[Object.keys(obj).length - 1] === key) return true;
    return false;
  }

  function convertToVisual(obj, key) {
    if (isLastElementInObject(obj, key)) return `\n└───${key} : ${obj[key]}`;
    return `\n├───${key} : ${obj[key]}`;
  }

  function jsonToSchema(rawObj) {
    let schemaObjString = '';
    if (isEmpty(rawObj))
      schemaObjString = `${schemaObjString} ${typeof rawObj}`;

    Object.keys(rawObj).forEach(key => {
      if (typeof rawObj[key] === 'object' && !isEmpty(rawObj[key])) {
        if (Array.isArray(rawObj[key])) {
          schemaObjString = `${schemaObjString}\n├───${key} : array[]`;
          rawObj[key].forEach(element => {
            const childSchema = jsonToSchema(element);
            schemaObjString = `${schemaObjString}\n│   ├───element:${childSchema.replaceAll(
              /\n/g,
              '\n│   │'
            )}`;
            schemaObjString.replaceAll(/\n/g, '\n|');
          });
        } else {
          const childSchema = jsonToSchema(rawObj[key]);
          schemaObjString = `${schemaObjString}\n├───${key}${childSchema.replaceAll(
            /\n/g,
            '\n│'
          )}`;
        }
      } else {
        schemaObjString += convertToVisual(rawObj, key);
      }
    });
    return schemaObjString.replaceAll(/\n/g, '\n   ');
  }

  function toggleOpen() {
    setOpen(!open);
  }

  function close() {
    setOpen(false);
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
        <Typography className={classes.title}>
          {title}
          <IconButton onClick={() => close()}>
            <FontAwesomeIcon icon={faXmark} />
          </IconButton>
        </Typography>

        <div className={classes.schemaContainer}>
          <Typography variant="h6" gutterBottom>
            Schema Format
          </Typography>

          <div className={classes.codeBlock}>
            <pre>
              <code>{`  root${jsonToSchema(serialisedSchema)}`}</code>
              {/* <code>{JSON.stringify(data, null, 2)}</code> */}
            </pre>
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default DownloadsSchemaDrawer;
