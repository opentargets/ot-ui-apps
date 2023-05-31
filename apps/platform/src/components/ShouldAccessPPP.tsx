import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  makeStyles,
} from '@material-ui/core';
import { useLocation } from 'react-router-dom';

const PPP_API_URL =
  'https://api.partner-platform.opentargets.org/api/v4/graphql';
const PPP_WEB_URL = 'https://partner-platform.opentargets.org';

const useStyles = makeStyles(() => ({
  paper: {
    padding: '1em 1em 2em',
    borderRadius: '12px',
  },
  actions: {
    '@media (max-width: 767px)': {
      flexDirection: 'column',
    },
  },
  button: {
    '@media (max-width: 767px)': {
      minHeight: 'auto',
      height: '100%',
      width: '100%',
      margin: '0 !important',
      marginTop: '0.3em !important',
    },
  },
}));

function ShouldAccessPPP() {
  const location = useLocation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    checkPPPaccess();
  }, []);

  const checkPPPaccess = () => {
    fetch(PPP_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operationName: 'DataVersion',
        variables: {},
        query: `query DataVersion {
        meta {
          dataVersion {
            month
            year
            __typename
          }
          __typename
	
      }
    }`,
      }),
    })
      .then(response => {
        if (response.status === 200 && isOnPublic()) handleOpen();
      })
      .catch(() => {
        console.log('Does not have access to Partner Preview Platform');
      });
  };

  const handleOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const goToPPP = () => {
    console.log(window.location.hostname);
    window.location.href = `${PPP_WEB_URL}${location.pathname}`;
  };

  const isOnPublic = () => {
    const location = window.location.href;
    return !location.includes('partner');
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="should-access-ppp"
      open={dialogOpen}
      classes={{
        paper: classes.paper,
      }}
    >
      <DialogTitle>
        Looks like you are part of the Open Targets Consortium!
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          We are pleased to inform you that you have access to our exclusive
          Partner Preview Platform &#40;PPP&#41;. This will have pre-publication data
          from OTAR projects and early access to the latest features, updates,
          and innovations before they are made available to the public.
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button
          className={classes.button}
          onClick={handleClose}
          variant="outlined"
        >
          Continue to Public Version
        </Button>
        <Button
          className={classes.button}
          onClick={goToPPP}
          variant="contained"
          color="primary"
        >
          Continue on Partner Preview Platform
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ShouldAccessPPP;
