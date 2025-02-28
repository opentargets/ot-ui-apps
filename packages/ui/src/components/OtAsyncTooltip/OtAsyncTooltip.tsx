import { ReactElement, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Divider,
  Skeleton,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from "@mui/material";
import { useLazyQuery } from "@apollo/client";
import { getEntityIcon, getEntityQuery, getQueryVariables } from "./utils/asyncTooltipUtil";
import { naLabel } from "../../constants";

import { getStudyItemMetaData } from "@ot/utils";

const DELAY_REQUEST = 1000;

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    maxWidth: 400,
    boxShadow: theme.boxShadow.default,
    cursor: "pointer",
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: 4,
  },

  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.white,
  },

  [`& .${tooltipClasses.arrow}::before`]: {
    border: `1px solid ${theme.palette.grey[300]}`,
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
  const [aborterRef] = useState(new AbortController());
  const [getTooltipData, { loading, data }] = useLazyQuery(query, {
    fetchPolicy: "network-only",
    context: { fetchOptions: { signal: aborterRef.signal } },
  });

  function getTooltipContent() {
    if (loading || !data) return <AsyncTooltipLoadingView />;
    return <AsyncTooltipDataView entity={entity} data={data?.[entity]} />;
  }

  function abortApiCall() {
    aborterRef.abort();
  }

  function handleClose() {
    setOpen(false);
    abortApiCall();
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

  const tooltipContent = getTooltipContent();

  return (
    <HtmlTooltip
      arrow
      placement="bottom-end"
      enterDelay={DELAY_REQUEST}
      enterNextDelay={DELAY_REQUEST}
      enterTouchDelay={DELAY_REQUEST}
      open={open}
      onClose={handleClose}
      onOpen={handleOpen}
      title={tooltipContent}
    >
      {children}
    </HtmlTooltip>
  );
}

function AsyncTooltipLoadingView(): ReactElement {
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

function AsyncTooltipDataView({
  entity,
  data,
}: {
  entity: string;
  data: Record<string, unknown>;
}): ReactElement {
  function getLabel() {
    return data?.name || data?.id || naLabel;
  }

  function getDescription() {
    let descText = "";

    if (Array.isArray(data.description) && data.description.length)
      descText = data?.description[0].substring(0, 150);
    else if (Array.isArray(data.description) && !data.description.length) descText = "";
    else if (data.description) descText = data?.description.substring(0, 150);

    // study subtext
    descText += getStudyItemMetaData({
      studyType: data?.studyType,
      nSamples: data?.nSamples,
      credibleSetsCount: data?.credibleSets?.credibleSetsCount,
    });

    if (!descText) return "No description available.";

    return descText;
  }

  function getSubtext() {
    let finalSubText = "";

    const mostSevereConsequence = data?.mostSevereConsequence?.label;

    if (mostSevereConsequence) finalSubText += `Most severe consequence: ${mostSevereConsequence}`;

    return finalSubText;
  }

  const showSubText = !!data?.mostSevereConsequence?.label;

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
      {showSubText && (
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
