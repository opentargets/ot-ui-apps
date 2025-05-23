import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";
import { Link, OtBtnGroup, OtCodeBlock, OtCopyToClipboard } from "ui";
import { v1 } from "uuid";

function DownloadsAccessOptionsDialog({ children, data, locationUrl, version }) {
  const [open, setOpen] = React.useState(false);
  const columnId = data["@id"].replace("-fileset", "");

  // TODO: check for one location: ppp
  const containedInArray = Array.isArray(data.containedIn) ? data.containedIn : [data.containedIn];

  const handleClickOpen = () => () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getLink = loc => {
    return `${locationUrl[loc]}/${columnId}`;
  };

  const LOCATION_MAP = {
    "http-location": {
      title: "Browse (link)",
      component: <HttpLocation link={getLink("ftp-location")} />,
    },
    "ftp-location": {
      title: "FTP location",
      component: <FtpLocation link={getLink("ftp-location")} />,
      // component: <FtpLocation link={getLink("ftp-location")} version={version} path={columnId} />,
    },
    "gcp-location": {
      title: "Google Cloud",
      component: <GcpLocation link={getLink("gcp-location")} />,
    },
  };

  const SCRIPT_MAP = {
    rsync: {
      title: "Rsync",
      component: <RsyncScript version={version} path={columnId} />,
    },
    wget: {
      title: "Wget",
      component: <WgetScript link={getLink("ftp-location")} />,
    },
  };

  return (
    <React.Fragment>
      <span onClick={handleClickOpen()}>{children}</span>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
            Access Options: {columnId}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Box tabIndex={-1} sx={{ wordBreak: "break-all", typography: "subtitle2" }}>
            <Typography variant="body1">File Location: </Typography>
            <OtBtnGroup btnGroup={LOCATION_MAP} />
          </Box>

          <Box tabIndex={-1} sx={{ wordBreak: "break-all", typography: "subtitle2", py: 2 }}>
            <Typography variant="body1">Access Script: </Typography>
            <OtBtnGroup btnGroup={SCRIPT_MAP} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

// function FtpLocation({ link, version, path }: { link: string; version: string; path: string }) {
//   const WgetCmd = `wget --recursive --no-parent --no-host-directories --cut-dirs 6
//         ftp://ftp.ebi.ac.uk/pub/databases/opentargets/platform/${version}/output/${path} .`;

//   const RsyncCmd = `rsync -rpltvz --delete rsync.ebi.ac.uk::pub/databases/opentargets/platform/${version}/output/${path} .`;
//   return (
//     <Box sx={{ p: 2 }}>
//       <Typography variant="subtitle2" gutterBottom>
//         FTP location (link)
//       </Typography>
//       <OtCodeBlock>
//         <Link to={link} external>
//           {link}
//         </Link>
//       </OtCodeBlock>

//       <Typography
//         sx={{ mt: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}
//       >
//         rsync
//       </Typography>
//       <OtCodeBlock textToCopy={RsyncCmd}>{RsyncCmd}</OtCodeBlock>
//       <Typography
//         variant="subtitle2"
//         gutterBottom
//         sx={{ mt: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}
//       >
//         Wget
//       </Typography>
//       <OtCodeBlock textToCopy={WgetCmd}>{WgetCmd}</OtCodeBlock>
//     </Box>
//   );
// }

// function GcpLocation({ link }: { link: string }) {
//   const cmd = `gcloud storage cp -r ${link}/ .`;
//   return (
//     <Box sx={{ p: 2 }}>
//       <Typography
//         variant="subtitle2"
//         gutterBottom
//         sx={{ mt: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}
//       >
//         Google Cloud
//       </Typography>
//       <OtCodeBlock textToCopy={cmd}> {cmd}</OtCodeBlock>
//     </Box>
//   );
// }

function HttpLocation({ link }: { link: string }) {
  const httpLink = link.replace("ftp", "http");
  return (
    <Box sx={{ p: 2 }}>
      {/* <Typography variant="subtitle2" gutterBottom>
        Browse (link)
      </Typography> */}
      <OtCodeBlock textToCopy={httpLink}>
        <Link to={httpLink} external>
          {httpLink}
        </Link>
      </OtCodeBlock>
    </Box>
  );
}

function GcpLocation({ link }: { link: string }) {
  return (
    <Box sx={{ p: 2 }}>
      {/* <Typography
        variant="subtitle2"
        gutterBottom
        sx={{ mt: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        Google Cloud
      </Typography> */}
      <OtCodeBlock textToCopy={link}> {link}</OtCodeBlock>
    </Box>
  );
}

function FtpLocation({ link }: { link: string }) {
  return (
    <Box sx={{ p: 2 }}>
      {/* <Typography variant="subtitle2" gutterBottom>
        Browse (link)
      </Typography> */}
      <OtCodeBlock textToCopy={link}>{link}</OtCodeBlock>
    </Box>
  );
}

function WgetScript({ link }: { link: string }) {
  const WgetCmd = `wget --recursive --no-parent --no-host-directories --cut-dirs 6 ${link} .`;

  return (
    <Box sx={{ p: 2 }}>
      <OtCodeBlock textToCopy={WgetCmd}>{WgetCmd}</OtCodeBlock>
    </Box>
  );
}

function RsyncScript({ version, path }: { version: string; path: string }) {
  const RsyncCmd = `rsync -rpltvz --delete rsync.ebi.ac.uk::pub/databases/opentargets/platform/${version}/output/${path} .`;
  return (
    <Box sx={{ p: 2 }}>
      <OtCodeBlock textToCopy={RsyncCmd}>{RsyncCmd}</OtCodeBlock>
    </Box>
  );
}

export default DownloadsAccessOptionsDialog;
