import { useState } from "react";
import { Box, Popover, Typography, IconButton, Snackbar } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";
import { Tooltip } from "ui";
import { lighten } from "polished";

const highlightBackground = theme => lighten(0.4, theme.palette.primary.main);

type DisplayVariantIdProps = {
  variandId: string;
  referenceAllele: string;
  alternateAllele: string;
  maxChars?: number;
};

function DisplayVariantId({ variantId, referenceAllele, alternateAllele, maxChars = 5 }) {

  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleCloseSnackbar() {
    setSnackbarOpen(false);
  }

  function copyToClipboard() {
    setSnackbarOpen(true);
    navigator.clipboard.writeText(fullName);
  }

  const open = Boolean(anchorEl);
  const id = open ? 'popover' : undefined;

  const stem = variantId.split('_').slice(0, -1).join('_');
  const longReferenceAllele = referenceAllele.length > maxChars;
  const longAlternateAllele = alternateAllele.length > maxChars;
  const fullName = `${stem}_${referenceAllele}_${alternateAllele}`;

  if (longReferenceAllele || longAlternateAllele) {
    return (
      <div>
        <Box
          aria-describedby={id}
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
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          slotProps={{
            paper: {
              sx: { position: "relative" }
            }
          }}  
        >
          <Box
            position="fixed"
            width="100%"
            // display="flex"
            // left={0}
            // right={0}
            bgcolor="white"
            sx={{borderBottom: "1px solid #ccc"}}
            zIndex={2}
          >
            <Typography variant="h6" padding="1rem">
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
          </Box>
          <Box p="5em 2em">
            <Box 
              sx={{
                backgroundColor: theme => theme.palette.grey[300],
                padding: "1em 3.5em 1em 1em",   
                fontSize: "0.9em",
                position: "relative"
              }}
            >
              <Tooltip
                title="Copy JSON to clipboard"
              >
                <IconButton
                  onClick={copyToClipboard}
                  sx={{
                    position: "absolute !important",
                    top: "0",
                    right: "0",
                    padding: "0.4em 0.5em !important",
                  }}
                >
                  <FontAwesomeIcon icon={faClipboard} />
                </IconButton>
              </Tooltip>
              <Typography
                variant="body2"
                sx={{
                  textWrap: "wrap",
                  wordWrap: "break-word",
                }}
              >
                {fullName}
              </Typography>
            </Box>
          </Box>
        </Popover>
        <Snackbar
          open={snackbarOpen}
          onClose={handleCloseSnackbar}
          message="Variant ID copied"
          autoHideDuration={3000}
        />
      </div>
    );
  }

  return fullName;

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

export default DisplayVariantId;