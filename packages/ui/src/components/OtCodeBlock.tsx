import { Box } from "@mui/material";
import OtCopyToClipboard from "./OtCopyToClipboard";
import type { ReactNode } from "react";

type OtCodeBlockPropTypes = {
  children: ReactNode;
  textToCopy?: string | null;
};

function OtCodeBlock({ children, textToCopy }: OtCodeBlockPropTypes) {
  return (
    <Box
      sx={{
        background: theme => theme.palette.grey[100],
        pb: textToCopy ? 3 : 1,
        borderRadius: 3,
        px: 3,
        pt: 1,
        display: "flex",
        minWidth: "100%",
        width: "fit-content",
      }}
    >
      <Box component="code" sx={{ width: 1 }}>
        {textToCopy && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              pb: 1,
              w: 1,
            }}
          >
            <OtCopyToClipboard textToCopy={textToCopy} />{" "}
          </Box>
        )}
        {children}
      </Box>
    </Box>
  );
}
export default OtCodeBlock;
