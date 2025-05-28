import { Box, Typography } from "@mui/material";
import { Link, OtBtnGroup, OtCodeBlock } from "ui";
import { singleBtnGroupObj } from "ui/src/components/OtBtnGroup";

const FTP = "ftp-location";
const GCP = "gcp-location";
// component ids to show when given location url
const DATA_MAP = {
  [FTP]: ["http-location", FTP, "rsync", "wget"],
  [GCP]: [GCP, "gcp"],
};

type DownloadsAccessOptionsProps = {
  data: Record<string, unknown>;
  locationUrl: Record<string, unknown>;
  version: string;
};

function DownloadsAccessOptions({ data, locationUrl, version }: DownloadsAccessOptionsProps) {
  if (!data) return <>access</>;

  const columnId = data["@id"].replace("-fileset", "");

  const containedInArray = Array.isArray(data.containedIn) ? data.containedIn : [data.containedIn];

  const getLink = loc => {
    return `${locationUrl[loc]}/${columnId}`;
  };

  const LOCATION_MAP: Record<string, singleBtnGroupObj> = {
    "http-location": {
      title: "Browse (link)",
      component: <HttpLocation link={getLink("ftp-location")} />,
    },
    "ftp-location": {
      title: "FTP location",
      component: <FtpLocation link={getLink("ftp-location")} />,
    },
    "gcp-location": {
      title: "Google Cloud",
      component: <GcpLocation link={getLink("gcp-location")} />,
    },
  };

  const SCRIPT_MAP: Record<string, singleBtnGroupObj> = {
    rsync: {
      title: "Rsync",
      component: <RsyncScript version={version} path={columnId} />,
    },
    wget: {
      title: "Wget",
      component: <WgetScript link={getLink("ftp-location")} />,
    },
    gcp: {
      title: "Google Cloud",
      component: <GcpScript link={getLink("gcp-location")} />,
    },
  };

  return (
    <>
      <Box tabIndex={-1} sx={{ wordBreak: "break-all", typography: "subtitle2" }}>
        <Typography variant="body1">File Location: </Typography>
        <OtBtnGroup btnGroup={getFilteredData({ allDataObj: LOCATION_MAP, containedInArray })} />
      </Box>

      <Box tabIndex={-1} sx={{ wordBreak: "break-all", typography: "subtitle2", py: 2 }}>
        <Typography variant="body1">Access Script: </Typography>
        <OtBtnGroup btnGroup={getFilteredData({ allDataObj: SCRIPT_MAP, containedInArray })} />
      </Box>
    </>
  );
}

function HttpLocation({ link }: { link: string }) {
  const httpLink = link.replace("ftp", "http");
  return (
    <Box sx={{ p: 2 }}>
      <OtCodeBlock textToCopy={httpLink}>
        <Link to={httpLink} external>
          {httpLink}
        </Link>
      </OtCodeBlock>
    </Box>
  );
}

function GcpLocation({ link }: { link: string }) {
  return (
    <Box sx={{ p: 2 }}>
      <OtCodeBlock textToCopy={link}> {link}</OtCodeBlock>
    </Box>
  );
}

function FtpLocation({ link }: { link: string }) {
  return (
    <Box sx={{ p: 2 }}>
      <OtCodeBlock textToCopy={link}>{link}</OtCodeBlock>
    </Box>
  );
}

function WgetScript({ link }: { link: string }) {
  const WgetCmd = `wget --recursive --no-parent --no-host-directories --cut-dirs 6 ${link} .`;

  return (
    <Box sx={{ p: 2 }}>
      <OtCodeBlock textToCopy={WgetCmd}>{WgetCmd}</OtCodeBlock>
    </Box>
  );
}

function RsyncScript({ version, path }: { version: string; path: string }) {
  const RsyncCmd = `rsync -rpltvz --delete rsync.ebi.ac.uk::pub/databases/opentargets/platform/${version}/output/${path} .`;
  return (
    <Box sx={{ p: 2 }}>
      <OtCodeBlock textToCopy={RsyncCmd}>{RsyncCmd}</OtCodeBlock>
    </Box>
  );
}

function GcpScript({ link }: { link: string }) {
  const cmd = `gcloud storage cp -r ${link}/ .`;
  return (
    <Box sx={{ p: 2 }}>
      <OtCodeBlock textToCopy={cmd}>{cmd}</OtCodeBlock>
    </Box>
  );
}

function getFilteredData({
  allDataObj,
  containedInArray,
}: {
  allDataObj: Record<string, singleBtnGroupObj>;
  containedInArray: Array<Record<"@id", string>>;
}) {
  const entriesToShow: Record<string, singleBtnGroupObj> = {};

  containedInArray.map(e => {
    DATA_MAP[e["@id"]].map(i => {
      if (Object.prototype.hasOwnProperty.call(allDataObj, i)) entriesToShow[i] = allDataObj[i];
    });
  });

  return entriesToShow;
}

export default DownloadsAccessOptions;
