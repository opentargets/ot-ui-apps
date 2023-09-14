import { useState } from 'react';
import { Drawer, IconButton, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
// update to font awesome icon
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  backdrop: {
    '& .MuiBackdrop-root': {
      opacity: '0 !important',
    },
  },
  codeBlock: {
    backgroundColor: theme.palette.grey[300],
    padding: ' 0.2em 2em',
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

function DownloadsSchemaDrawer({ title, children }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const data = {
    type: 'struct',
    fields: [
      { name: 'id', type: 'string', nullable: true, metadata: {} },
      {
        name: 'tissues',
        type: {
          type: 'array',
          elementType: {
            type: 'struct',
            fields: [
              {
                name: 'efo_code',
                type: 'string',
                nullable: true,
                metadata: {},
              },
              { name: 'label', type: 'string', nullable: true, metadata: {} },
              {
                name: 'organs',
                type: {
                  type: 'array',
                  elementType: 'string',
                  containsNull: true,
                },
                nullable: true,
                metadata: {},
              },
              {
                name: 'anatomical_systems',
                type: {
                  type: 'array',
                  elementType: 'string',
                  containsNull: true,
                },
                nullable: true,
                metadata: {},
              },
              {
                name: 'rna',
                type: {
                  type: 'struct',
                  fields: [
                    {
                      name: 'value',
                      type: 'double',
                      nullable: true,
                      metadata: {},
                    },
                    {
                      name: 'zscore',
                      type: 'integer',
                      nullable: true,
                      metadata: {},
                    },
                    {
                      name: 'level',
                      type: 'integer',
                      nullable: true,
                      metadata: {},
                    },
                    {
                      name: 'unit',
                      type: 'string',
                      nullable: true,
                      metadata: {},
                    },
                  ],
                },
                nullable: false,
                metadata: {},
              },
              {
                name: 'protein',
                type: {
                  type: 'struct',
                  fields: [
                    {
                      name: 'reliability',
                      type: 'boolean',
                      nullable: true,
                      metadata: {},
                    },
                    {
                      name: 'level',
                      type: 'integer',
                      nullable: true,
                      metadata: {},
                    },
                    {
                      name: 'cell_type',
                      type: {
                        type: 'array',
                        elementType: {
                          type: 'struct',
                          fields: [
                            {
                              name: 'name',
                              type: 'string',
                              nullable: true,
                              metadata: {},
                            },
                            {
                              name: 'reliability',
                              type: 'boolean',
                              nullable: true,
                              metadata: {},
                            },
                            {
                              name: 'level',
                              type: 'integer',
                              nullable: true,
                              metadata: {},
                            },
                          ],
                        },
                        containsNull: false,
                      },
                      nullable: false,
                      metadata: {},
                    },
                  ],
                },
                nullable: false,
                metadata: {},
              },
            ],
          },
          containsNull: false,
        },
        nullable: false,
        metadata: {},
      },
    ],
  };

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
      <span onClick={() => toggleOpen()}>{children}</span>
      <Drawer
        classes={{ root: classes.backdrop }}
        open={open}
        onClose={() => close()}
        anchor="right"
      >
        <Typography className={classes.title}>
          {title}
          <IconButton onClick={() => close()}>
            <CloseIcon />
          </IconButton>
        </Typography>

        <div className={classes.schemaContainer}>
          <Typography variant="h6" gutterBottom>
            Schema Format
          </Typography>

          <div className={classes.codeBlock}>
            <pre>
              <code>{`root ${jsonToSchema(data)}`}</code>
              {/* <code>{JSON.stringify(data, null, 2)}</code> */}
            </pre>
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default DownloadsSchemaDrawer;
