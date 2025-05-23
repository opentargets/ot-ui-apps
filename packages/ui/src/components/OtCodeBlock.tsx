import { Box } from "@mui/material";
import OtCopyToClipboard from "./OtCopyToClipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { ReactNode } from "react";

type OtCodeBlockPropTypes = {
  children: ReactNode;
  textToCopy?: string | null;
};

function OtCodeBlock({ children, textToCopy }: OtCodeBlockPropTypes) {
  return (
    <Box
      sx={{
        display: "flex",
        borderRadius: 3,
        background: theme => theme.palette.grey[100],
        color: theme => theme.palette.grey[800],
        px: 3,
        py: 1,
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
                <Box component="span" sx={{ color: theme => theme.palette.grey[600] }}>
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
