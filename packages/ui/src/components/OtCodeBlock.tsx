import { Box } from "@mui/material";
import OtCopyToClipboard from "./OtCopyToClipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
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
        width: "fit-content",
      }}
    >
      <code>
        {textToCopy && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              pb: 1,
            }}
          >
            <OtCopyToClipboard
              textToCopy={textToCopy}
              displayElement={
                <Box component="span" sx={{ color: theme => theme.palette.grey[700] }}>
                  {" "}
                  <FontAwesomeIcon icon={faCopy} />
                </Box>
              }
            />{" "}
          </Box>
        )}
        {children}
      </code>
    </Box>
  );
}
export default OtCodeBlock;
