import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Typography } from "@mui/material";
import Link from "../Link";

const docsLink = "";

function VariantMessage({ inputValue }: { inputValue: string }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        borderRadius: 0.5,
        gap: 1,
        pl: 2,
        pr: 1,
        py: 1,
        my: 1,
      }}
    >
      <Box>
        <FontAwesomeIcon icon={faInfoCircle} />
      </Box>
      <Typography variant="body2" fontStyle="italic">
        No exact match found. We only include variants with known phenotypic associations{" "}
        <Link to={docsLink}>(documentation)</Link>
      </Typography>
    </Box>
  );
}
export default VariantMessage;
