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
import { Link, OtCodeBlock } from "ui";
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
            Access Options: {data["@id"]}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Box tabIndex={-1} sx={{ wordBreak: "break-all" }}>
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

function FtpLocation({ link, version, path }) {
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

      <Typography sx={{ mt: 1 }}>rsync</Typography>
      <OtCodeBlock>
        rsync -rpltvz --delete rsync.ebi.ac.uk::pub/databases/opentargets/platform/{version}/output/
        {path} .
      </OtCodeBlock>
      <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
        Wget
      </Typography>
      <OtCodeBlock>
        wget --recursive --no-parent --no-host-directories --cut-dirs 6
        ftp://ftp.ebi.ac.uk/pub/databases/opentargets/platform/{version}/output/{path} .
      </OtCodeBlock>
    </>
  );
}

function GcpLocation({ link }) {
  return (
    <>
      <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
        Google Cloud
      </Typography>
      <OtCodeBlock> gsutil -m cp -r {link}/</OtCodeBlock>
    </>
  );
}

export default DownloadsAccessOptionsDialog;
