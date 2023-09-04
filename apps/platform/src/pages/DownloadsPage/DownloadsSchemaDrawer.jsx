import { useState } from 'react';
import {
  Drawer,
  IconButton,
  Paper,
  Typography,
  makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { AsciiTree } from 'oo-ascii-tree';
import { formatMap } from '../../constants';

const useStyles = makeStyles(theme => ({
  backdrop: {
    '& .MuiBackdrop-root': {
      opacity: '0 !important',
    },
  },
  codeBlock: {
    backgroundColor: theme.palette.grey[300],
    padding: '2em',
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

function DownloadsSchemaDrawer({ title, format, children }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const data = {
    id: 'Orphanet_98261',
    code: 'http://www.orpha.net/ORDO/Orphanet_98261',
    dbXRefs: [
      'OMIM:616540',
      'MeSH:D020191',
      'OMIM:616187',
      'UMLS:C0751778',
      'OMIM:616230',
    ],
    name: 'Progressive myoclonic epilepsy',
    parents: ['Orphanet_183512'],
    synonyms: { hasExactSynonym: ['PME', 'Progressive myoclonus epilepsy'] },
    ancestors: [
      'Orphanet_71859',
      'Orphanet_183512',
      'OTAR_0000018',
      'EFO_0000508',
    ],
    descendants: [
      'Orphanet_1947',
      'Orphanet_308',
      'Orphanet_228340',
      'Orphanet_228360',
      'Orphanet_228366',
      'Orphanet_228354',
      'Orphanet_228343',
      'Orphanet_168486',
      'Orphanet_228363',
      'Orphanet_228337',
      'Orphanet_551',
      'Orphanet_228357',
      'Orphanet_228346',
      'Orphanet_352709',
      'Orphanet_314629',
      'Orphanet_228329',
      'Orphanet_228349',
    ],
    children: [
      'Orphanet_168486',
      'Orphanet_1947',
      'Orphanet_228329',
      'Orphanet_228340',
      'Orphanet_228343',
      'Orphanet_228346',
      'Orphanet_228349',
      'Orphanet_228354',
      'Orphanet_228357',
      'Orphanet_228360',
      'Orphanet_228363',
      'Orphanet_228366',
      'Orphanet_308',
      'Orphanet_314629',
      'Orphanet_352709',
      'Orphanet_551',
    ],
    therapeuticAreas: ['OTAR_0000018'],
    ontology: {
      isTherapeuticArea: false,
      leaf: false,
      sources: {
        url: 'http://www.orpha.net/ORDO/Orphanet_98261',
        name: 'Orphanet_98261',
      },
    },
  };
  const tree = new AsciiTree();

  function iterate(obj, root = 'root') {
    const parentTree = new AsciiTree(root);
    Object.keys(obj).forEach(key => {
      if (Array.isArray(obj[key])) {
        parentTree.add(
          new AsciiTree(
            `${key}: array`,
            new AsciiTree(`element: ${typeof obj[key][0]}`)
          )
        );
      } else if (typeof obj[key] === 'object') {
        parentTree.add(iterate(obj[key], `${key} : object`));
      } else parentTree.add(new AsciiTree(`${key}: ${typeof obj[key]}`));
    });
    return parentTree;
  }
  tree.add(iterate(data));

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
            {formatMap[format]} Schema Format
          </Typography>

          <div className={classes.codeBlock}>
            <pre>
              <code>{tree.toString()}</code>
            </pre>
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default DownloadsSchemaDrawer;
