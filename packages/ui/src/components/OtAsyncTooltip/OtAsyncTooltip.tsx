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
import { useLazyQuery } from "@apollo/client";
import { getEntityIcon, getEntityQuery, getQueryVariables } from "./utils/asyncTooltipUtil";

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
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

  function getTooltipContent() {
    if (loading) return getAsyncTooltipLoadingView();
    return getAsyncTooltipDataView(entity, data?.[entity]);
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

function getAsyncTooltipLoadingView(): ReactElement {
  return (
    <Box sx={{ width: 300 }}>
      <Box>
        <Skeleton />
        <Skeleton />
      </Box>
      <Skeleton />
      <Skeleton />
    </Box>
  );
}

function getAsyncTooltipDataView(entity: string, data: Record<string, unknown>): ReactElement {
  function getLabel() {
    return data?.name || data?.id;
  }

  function getDescription() {
    console.log(data);
    let descText = "";

    if (data?.description)
      if (Array.isArray(data?.description)) descText = data?.description[0].substring(0, 150);
      else descText = data?.description.substring(0, 150);

    const studyType = data?.studyType;
    const nSamples = data?.nSamples;
    const credibleSetsCount = data?.credibleSets?.credibleSetsCount;

    // study subtext
    if (studyType) descText += `Study type: ${studyType} • `;
    if (nSamples) descText += `Sample size: ${nSamples} • `;
    if (credibleSetsCount) descText += `Credible sets count: ${credibleSetsCount}`;

    return descText;
  }

  function getSubtext() {
    let finalSubText = "";

    const mostSevereConsequence = data?.mostSevereConsequence?.label;

    if (mostSevereConsequence) finalSubText += `Most severe consequence: ${mostSevereConsequence}`;

    return finalSubText;
  }

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
        {`${entity}/${data?.id}`}
      </Box>
      <Box sx={{ display: "flex", gap: 1, py: 1 }}>
        <Box sx={{ p: 1, color: theme => theme.palette.primary.main }}>
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
          <Box sx={{ typography: "body2", color: theme => theme.palette.grey[800] }}>
            {getDescription()}
          </Box>
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

export default OtAsyncTooltip;
