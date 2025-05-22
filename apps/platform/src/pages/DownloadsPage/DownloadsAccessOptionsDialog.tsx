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
import { Link, OtCodeBlock, OtCopyToClipboard } from "ui";
import { v1 } from "uuid";

function DownloadsAccessOptionsDialog({ children, data, locationUrl, version }) {
  const [open, setOpen] = React.useState(false);
  const columnId = data["@id"].replace("-fileset", "");

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
    "ftp-location": (
      <FtpLocation link={getLink("ftp-location")} version={version} path={columnId} />
    ),
    "gcp-location": <GcpLocation link={getLink("gcp-location")} />,
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
            Access Options: {data["@id"].replace("-fileset", "")}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Box tabIndex={-1} sx={{ wordBreak: "break-all", typography: "subtitle2" }}>
            {containedInArray.map(e => (
              <div key={v1()}>{LOCATION_MAP[e["@id"]]}</div>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

function FtpLocation({ link, version, path }: { link: string; version: string; path: string }) {
  const WgetCmd = `wget --recursive --no-parent --no-host-directories --cut-dirs 6
        ftp://ftp.ebi.ac.uk/pub/databases/opentargets/platform/${version}/output/${path} .`;

  const RsyncCmd = `rsync -rpltvz --delete rsync.ebi.ac.uk::pub/databases/opentargets/platform/${version}/output/
        ${path} .`;
  return (
    <>
      <Typography variant="subtitle2" gutterBottom>
        FTP location (link)
      </Typography>
      <OtCodeBlock>
        <Link to={link} external>
          {link}
        </Link>
      </OtCodeBlock>

      <Typography
        sx={{ mt: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        rsync
        <OtCopyToClipboard
          displayElement={<FontAwesomeIcon icon={faCopy} />}
          textToCopy={RsyncCmd}
        />
      </Typography>
      <OtCodeBlock>{RsyncCmd}</OtCodeBlock>
      <Typography
        variant="subtitle2"
        gutterBottom
        sx={{ mt: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        Wget
        <OtCopyToClipboard
          displayElement={<FontAwesomeIcon icon={faCopy} />}
          textToCopy={WgetCmd}
        />
      </Typography>
      <OtCodeBlock>{WgetCmd}</OtCodeBlock>
    </>
  );
}

function GcpLocation({ link }: { link: string }) {
  const cmd = `gcloud storage cp -r ${link}/ .`;
  return (
    <>
      <Typography
        variant="subtitle2"
        gutterBottom
        sx={{ mt: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        Google Cloud
        <OtCopyToClipboard displayElement={<FontAwesomeIcon icon={faCopy} />} textToCopy={cmd} />
      </Typography>
      <OtCodeBlock> {cmd}</OtCodeBlock>
    </>
  );
}

export default DownloadsAccessOptionsDialog;
