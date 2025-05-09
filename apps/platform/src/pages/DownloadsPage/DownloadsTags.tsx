import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { DownloadsContext } from "./context/DownloadsContext";
import { useContext, useState } from "react";
import { Link, OtCodeBlock } from "ui";

function DownloadsTags() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, p: 1, flexWrap: "wrap" }}>
      <VersionTag />
      <DOITag />
      <LibrariesTag />
      <FormatsTag />
      <LanguagesTag />
    </Box>
  );
}

function LibrariesTag() {
  const { state } = useContext(DownloadsContext);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography>Libraries:</Typography>
      <TagsDialog
        title={"About this format"}
        body={
          <Box>
            Our scripts and schema conforms to Croissant. This is a standard format for dataset
            metadata.{" "}
            <Link to={state.downloadsData?.conformsTo} external>
              {" "}
              Read more
            </Link>
            <Box>Add download raw file option here</Box>
          </Box>
        }
      >
        <Chip clickable label={"Croissant"} size="small" />
      </TagsDialog>
    </Box>
  );
}

function VersionTag() {
  const { state } = useContext(DownloadsContext);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography>Version:</Typography>
      <Link to={"https://platform-docs.opentargets.org/release-notes"} external>
        <Chip clickable label={state.downloadsData?.version} size="small" />
      </Link>
    </Box>
  );
}

function LanguagesTag() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography>Languages:</Typography>
      <Chip label="English" size="small" variant="outlined" />
    </Box>
  );
}

function DOITag() {
  const { state } = useContext(DownloadsContext);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography>DOI:</Typography>
      <TagsDialog
        title={"Cite As"}
        body={
          <>
            <Box sx={{ display: "flex" }}>
              <OtCodeBlock>{state.downloadsData?.citeAs}</OtCodeBlock>
            </Box>
          </>
        }
      >
        <Chip label="add pmid?" size="small" clickable />
      </TagsDialog>
    </Box>
  );
}

function FormatsTag() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography>Formats:</Typography>
      <TagsDialog
        title={"File Format"}
        body={
          <>
            <Box sx={{ display: "flex" }}>
              <Typography>Read about this format </Typography>
              <Link to={"https://parquet.apache.org/docs/overview/"} external>
                {" "}
                here.
              </Link>
            </Box>
          </>
        }
      >
        <Chip label="Parquet" size="small" clickable />
      </TagsDialog>
    </Box>
  );
}

function TagsDialog({ title, body, children }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <span onClick={handleClickOpen()}>{children}</span>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
            {title}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>{body}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default DownloadsTags;
