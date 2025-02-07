import { ReactElement, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Divider,
  Fade,
  Skeleton,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from "@mui/material";
import { faPrescriptionBottleAlt } from "@fortawesome/free-solid-svg-icons";
import { useLazyQuery } from "@apollo/client";
import { getEntityIcon, getEntityQuery, getQueryVariables } from "./utils/asyncTooltipUtil";

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 400,
    boxShadow: theme.shadows[1],
    cursor: "pointer",
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: 4,
  },

  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.white,
  },

  [`& .${tooltipClasses.arrow}::before`]: {
    border: `2px solid ${theme.palette.grey[300]}`,
  },
}));

type OtAsyncTooltipProps = {
  children: ReactElement;
  entity: string;
  id: string;
};

function OtAsyncTooltip({ children, entity, id }: OtAsyncTooltipProps): ReactElement {
  const variables = getQueryVariables(entity, id);

  const query = getEntityQuery(entity);
  const [open, setOpen] = useState(false);
  const [aborterRef, setAbortRef] = useState(new AbortController());
  const [getTooltipData, { loading, error, data }] = useLazyQuery(query, {
    fetchPolicy: "network-only",
  });

  const tooltipLoadingView = (
    <Box sx={{ width: 300 }}>
      <Box>
        <Skeleton />
        <Skeleton />
      </Box>
      <Skeleton />
      <Skeleton />
    </Box>
  );

  function getLabel() {
    return data?.[entity].name || data?.[entity].id;
  }

  function getDescription() {
    let descText = "";

    if (data?.[entity].description)
      if (Array.isArray(data?.[entity].description))
        descText = data?.[entity].description[0].substring(0, 150);
      else descText = data?.[entity].description.substring(0, 150);

    const studyType = data?.[entity].studyType;
    const nSamples = data?.[entity].nSamples;
    const credibleSetsCount = data?.[entity].credibleSets?.credibleSetsCount;

    // study subtext
    if (studyType) descText += `Study type: ${studyType} • `;
    if (nSamples) descText += `Sample size: ${nSamples} • `;
    if (credibleSetsCount) descText += `Credible sets count: ${credibleSetsCount}`;

    return descText;
  }

  function getSubtext() {
    let finalSubText = "";

    const mostSevereConsequence = data?.[entity].mostSevereConsequence?.label;

    if (mostSevereConsequence) finalSubText += `Most severe consequence: ${mostSevereConsequence}`;

    return finalSubText;
  }

  function getTooltipContent() {
    if (loading) return tooltipLoadingView;
    return (
      <Box sx={{ p: 1 }}>
        <Box
          sx={{
            p: 1,
            py: 0,
            fontSize: "0.7rem",
            color: theme => theme.palette.grey[700],
            textDecoration: "underline",
          }}
        >
          {`${entity}/${data?.[entity].id}`}
        </Box>
        <Box sx={{ display: "flex", gap: 1, py: 1 }}>
          <Box sx={{ p: 1, color: theme => theme.palette.primary.main }}>
            {/*  TODO: get icon function */}
            <FontAwesomeIcon size="2x" icon={getEntityIcon(entity)}></FontAwesomeIcon>
          </Box>
          <Box sx={{ pt: 0.4 }}>
            <Box
              sx={{
                typography: "subtitle2",
                color: theme => theme.palette.grey[900],
                textTransform: "capitalize",
                fontWeight: "bold",
              }}
            >
              {getLabel()}
            </Box>{" "}
            <Box sx={{ typography: "body2" }}>{getDescription()}</Box>
          </Box>
        </Box>
        {getSubtext() && (
          <>
            <Divider />
            <Box
              sx={{ typography: "caption", color: theme => theme.palette.grey[900], pt: 1, pl: 1 }}
            >
              {getSubtext()}
            </Box>
          </>
        )}
      </Box>
    );
  }

  function abortApiCall() {
    aborterRef.abort();
    setAbortRef(new AbortController());
  }

  function handleClose() {
    abortApiCall();
    setOpen(false);
  }

  function handleOpen() {
    getTooltipData({ variables });
    setOpen(true);
  }

  useEffect(() => {
    return () => {
      abortApiCall();
    };
  }, []);

  return (
    <HtmlTooltip
      arrow
      slots={{
        transition: Fade,
      }}
      slotProps={{
        transition: { timeout: 600 },
      }}
      open={open}
      onClose={handleClose}
      onOpen={handleOpen}
      title={getTooltipContent()}
      placement="bottom-end"
    >
      {children}
    </HtmlTooltip>
  );
}

export default OtAsyncTooltip;
