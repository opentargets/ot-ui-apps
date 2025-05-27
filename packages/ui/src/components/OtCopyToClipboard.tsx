import { Box, Snackbar } from "@mui/material";
import { grey } from "@mui/material/colors";
import { ReactNode, useState } from "react";

type OtCopyToClipboardProps = {
  displayElement: ReactNode | null;
  textToCopy: string;
};

function OtCopyToClipboard({ displayElement, textToCopy }: OtCopyToClipboardProps) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  function copyToClipboard() {
    setSnackbarOpen(true);
    navigator.clipboard.writeText(textToCopy);
  }

  function handleCloseSnackbar() {
    setSnackbarOpen(false);
  }

  return (
    <>
      <Box
        component="button"
        onClick={copyToClipboard}
        sx={{
          cursor: "pointer",
          py: "5px",
          px: "8px",
          border: "none",
          // borderColor: grey[400],
          borderRadius: 1,
          backgroundColor: grey[300],
        }}
      >
        {displayElement || `copy`}
      </Box>
      <Snackbar
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        message="Copied to clipboard"
        autoHideDuration={3000}
      />
    </>
  );
}
export default OtCopyToClipboard;
