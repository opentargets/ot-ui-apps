import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";
import { Tooltip } from "ui";
import { lighten } from "polished";

const highlightBackground = theme => lighten(0.4, theme.palette.primary.main);

type DisplayVariantIdProps = {
  variantId: string;
  referenceAllele: string;
  alternateAllele: string;
  maxChars?: number;
};

function DisplayVariantId({
    variantId,
    referenceAllele,
    alternateAllele,
    maxChars = 6}: DisplayVariantIdProps) {

  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function handleCloseSnackbar() {
    setSnackbarOpen(false);
  }

  function copyToClipboard(text: string) {
    setSnackbarOpen(true);
    navigator.clipboard.writeText(text);
  }

  const stem = variantId.split('_').slice(0, -1).join('_');
  const longReferenceAllele = referenceAllele.length > maxChars;
  const longAlternateAllele = alternateAllele.length > maxChars;
  const fullVariantId = `${stem}_${referenceAllele}_${alternateAllele}`;

  if (longReferenceAllele || longAlternateAllele) {
    return (
      <div>
        <Box
          onClick={handleClick}
          title="Show full variant ID"
          sx={{
            cursor: "pointer",
            padding: "2px 6px",
            borderRadius: "10px",
            "&:hover": {
              background: highlightBackground,
            }
          }}
        >
          {stem}
          _
          {longReferenceAllele
            ? <HighlightBox>...</HighlightBox>
            : referenceAllele
          }
          _
          {longAlternateAllele
            ? <HighlightBox>...</HighlightBox>
            : alternateAllele
          }
        </Box>
        <Dialog
          open={open}
          onClose={handleClose}
          scroll="paper"
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
          maxWidth="md"
        >
          <DialogTitle id="dialog-title">
            <Typography variant="h6">
              Variant ID
            </Typography>
            <IconButton
              onClick={handleClose}
              sx={{
                zIndex: "2",
                position: "absolute",
                top: "0",
                right: "0",
                padding: "0.7em",
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </IconButton>
          </DialogTitle>
          <DialogContent
            dividers={true}
            sx={{ padding: "0 1.5em 3em" }}
          >
            <CopyPanel
              heading="Hashed Variant ID"
              tooltipText="The variant ID used in Open Targets data."
              text={variantId}
              copyToClipboard={copyToClipboard}
            />
            <CopyPanel
              heading="Full Variant ID"
              text={fullVariantId}
              copyToClipboard={copyToClipboard}
            />
          </DialogContent>
        </Dialog>
        <Snackbar
          open={snackbarOpen}
          onClose={handleCloseSnackbar}
          message="Copied to clipboard"
          autoHideDuration={3000}
        />
      </div>
    );
  }

  return fullVariantId;

}

function HighlightBox({ children }) {
  return (
    <Box
      display="inline-block"
      borderRadius={5}
      mx={0.5}
      px={0.5}
      bgcolor={highlightBackground}
    >
      {children}
    </Box>
  );
}

function CopyPanel({ heading, text, tooltipText, copyToClipboard }) {
  return (
    <Box mt={2}>
      {
        tooltipText
          ? <Tooltip title={tooltipText} showHelpIcon>
              <Typography variant="subtitle1" component="span">{heading}</Typography>
            </Tooltip>
          : <Typography variant="subtitle1">{heading}</Typography>
      }
      <Box sx={{
          marginTop: '0.1em',
          backgroundColor: theme => theme.palette.grey[300],
          position: "relative",
        }}
      >
        <Box position="absolute" top={0} right={0}>
          <Tooltip title="Copy to clipboard">
            <IconButton
              onClick={() => copyToClipboard(text)}
              sx={{ padding: "0.4em 0.5em !important" }}
            >
              <FontAwesomeIcon icon={faClipboard} />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography
          variant="body2"
          sx={{
            padding: "1em 3.2em 1em 1em",   
            textWrap: "wrap",
            wordWrap: "break-word",
          }}
        >
          {text}
        </Typography>
      </Box>
    </Box>
  );
}

export default DisplayVariantId;