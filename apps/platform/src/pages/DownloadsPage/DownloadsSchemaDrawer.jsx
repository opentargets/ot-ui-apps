import { useState } from 'react';
import { Box, Drawer, IconButton, Snackbar, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import { Tooltip } from 'ui';

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
  clipboard: {
    position: 'absolute !important',
    top: '0',
    right: '0',
    padding: '0.4em 0.5em !important',
  },
  closeButton: {
    zIndex: '2',
    position: 'fixed',
    top: 0,
    right: 0,
    padding: '0.7em',
  },
  codeBlock: {
    backgroundColor: theme.palette.grey[300],
    padding: '0.2em 2em 0.2em 0.2em',
    fontSize: '0.85em',
    position: 'relative',
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderBottom: '1px solid #ccc',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    padding: '1rem',
    position: 'fixed',
    width: '100%',
    zIndex: '1',
  },
  schemaContainer: {
    padding: '5em 2em',
  },
}));

function DownloadsSchemaDrawer({ title, children, serialisedSchema = {} }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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
            <Tooltip title="Copy schema to clipboard">
              <IconButton
                className={classes.clipboard}
                onClick={() => copyToClipboard()}
              >
                <FontAwesomeIcon icon={faClipboard} />
              </IconButton>
            </Tooltip>
            <pre>
              <code>{`   root${jsonToSchema(serialisedSchema)}`}</code>
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
