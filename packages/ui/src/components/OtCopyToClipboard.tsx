import { Snackbar } from "@mui/material";
import { styled } from "@mui/styles";
import { ReactNode, useState } from "react";

const UnstyledButton = styled("button")({
  border: "none",
  cursor: "pointer",
  background: "none",
});

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
      <UnstyledButton onClick={copyToClipboard}>{displayElement || `copy`}</UnstyledButton>
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
