import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Fade,
  Skeleton,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Link from "../Link";
import { faPrescriptionBottleAlt } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@apollo/client";

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    // boxShadow: theme.shadows[1],

    // maxWidth: 220,
    // fontSize: theme.typography.pxToRem(12),
    border: "1px solid rgb(54, 54, 54)",
  },
}));

function OtAsyncTooltip({ children, entity }) {
  const [aborterRef, setAbortRef] = useState(new AbortController());
  // const request = useQuery(query, { variables });

  const tooltipLoadingView = (
    <Box>
      <Box>
        <Skeleton />
        <Skeleton />
      </Box>
      <Skeleton />
      <Skeleton />
    </Box>
  );

  useEffect(() => {
    // make api call

    return () => {
      // cancel api call of tooltip removed if in progress
      aborterRef.abort();
      setAbortRef(new AbortController());
    };
  }, []);

  return (
    <HtmlTooltip
      slots={{
        transition: Fade,
      }}
      slotProps={{
        transition: { timeout: 600 },
      }}
      title={
        <>
          <Box>
            <Link to="/drug/CHEMBL468</">/drug/CHEMBL468</Link>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Box>
              <FontAwesomeIcon icon={faPrescriptionBottleAlt}></FontAwesomeIcon>
            </Box>
            <Box>
              <Box>
                <Link to="/drug/CHEMBL468</">THALIDOMIDE</Link>
              </Box>
              <Box>Small molecule drug with a maximum clinical....</Box>
            </Box>
          </Box>
          <Box></Box>
        </>
      }
    >
      <button>{children}</button>
    </HtmlTooltip>
  );
}

export default OtAsyncTooltip;
