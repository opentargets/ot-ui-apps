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
      variantId: otVariantId,
      referenceAllele,
      alternateAllele,
      maxChars = 6
    }: DisplayVariantIdProps) {

  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  function handleClick() {
    setOpen(true);
  };

  function handleClose() {
    setOpen(false);
  };

  function handleCloseSnackbar() {
    setSnackbarOpen(false);
  }

  function copyToClipboard(text: string) {
    setSnackbarOpen(true);
    navigator.clipboard.writeText(text);
  }

  const idParts = otVariantId.split('_');
  let isHashed, stem, fullVariantId;
  if (idParts.at(-2) === referenceAllele &&
      idParts.at(-1) === alternateAllele) {
    isHashed = false;
    stem = idParts.slice(0, -2).join('_');
    fullVariantId = otVariantId;
  } else {
    isHashed = true;
    stem = idParts.slice(0, -1).join('_');
    fullVariantId = `${stem}_${referenceAllele}_${alternateAllele}`;
  }

  const longReferenceAllele = referenceAllele.length > maxChars;
  const longAlternateAllele = alternateAllele.length > maxChars;

  if (isHashed || longReferenceAllele || longAlternateAllele) {
    return (
      <>
        <Box
          component="span"
          onClick={handleClick}
          title="Show variant ID"
          sx={{
            cursor: "pointer",
            padding: "0 0.06em",
            borderRadius: "0.3em",
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
            <Typography variant="h6" component="span">
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
            { isHashed &&
                <CopyPanel
                  label="Hashed Variant ID"
                  tooltipText="Variant ID used in Open Targets data."
                  text={otVariantId}
                  copyToClipboard={copyToClipboard}
                />
            }
            <CopyPanel
              label="Full Variant ID"
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
      </>
    );
  }

  return fullVariantId;

}

function HighlightBox({ children }) {
  return (
    <Box
      component="span"
      borderRadius="0.3em"
      mx="0.1em"
      px="0.15em"
      bgcolor={highlightBackground}
    >
      {children}
    </Box>
  );
}

type CopyPanelProps = {
  label: string;
  text: string;
  tooltipText?: string;
  copyToClipboard: (text: string) => void;
};

function CopyPanel({ label, text, tooltipText, copyToClipboard }: CopyPanelProps) {
  return (
    <Box mt={2}>
      {
        tooltipText
          ? <Tooltip title={tooltipText} showHelpIcon>
              <Typography variant="subtitle1" component="span">{label}</Typography>
            </Tooltip>
          : <Typography variant="subtitle1">{label}</Typography>
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