import FileSaver from "file-saver";
import { Box, Chip, Divider, Popover } from "@mui/material";
import { DownloadsContext } from "./context/DownloadsContext";
import { useContext, useState } from "react";
import { Link, PublicationsDrawer } from "ui";
import { styled } from "@mui/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft, faFileLines, faTableList } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { epmcUrl } from "@ot/utils";

const DownloadsLink = styled("a")(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: "inherit",
  "text-decoration-color": "transparent",
  "-webkit-text-decoration-color": "transparent",
  marginTop: `10px !important`,
  "&:hover": {
    color: theme.palette.primary.dark,
    "text-decoration-color": theme.palette.primary.dark,
    "-webkit-text-decoration-color": theme.palette.primary.dark,
  },
}));

function DownloadsTags() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, p: 1, flexWrap: "wrap" }}>
      <DOITag />
      <LibrariesTag />
      <FormatsTag />
      <VersionTag />
    </Box>
  );
}

function LibrariesTag() {
  const { state } = useContext(DownloadsContext);
  const saveMetadata = () => {
    const blobOptions = { type: "application/json;charset=utf-8" };
    const blob = new Blob([JSON.stringify(state.downloadsData, null, 2)], blobOptions);
    FileSaver.saveAs(blob, "croissant.json");
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <TagsDialog
        title={"About this format"}
        body={
          <Box>
            Our scripts and schema conforms to Croissant. This is a standard format for dataset
            metadata.{" "}
            <Link to={state.downloadsData?.conformsTo} external>
              {" "}
              Read more
            </Link>
            {/* <Divider /> */}
            <Box sx={{ pt: 1 }}>
              <Link onClick={saveMetadata}> Download Croissant metadata</Link>
            </Box>
          </Box>
        }
      >
        <Chip
          clickable
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {" "}
              <FontAwesomeIcon icon={faAlignLeft} /> Croissant
            </Box>
          }
          size="small"
        />
      </TagsDialog>
    </Box>
  );
}

function VersionTag() {
  const { state } = useContext(DownloadsContext);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <TagsDialog
        title={`Current version: ${state.downloadsData?.version}`}
        body={
          <Box>
            <Link to={"https://platform-docs.opentargets.org/release-notes"} external>
              Read more
            </Link>{" "}
            on release highlights for the Open Targets Platform{" "}
          </Box>
        }
      >
        <Chip
          clickable
          label={
            <>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {" "}
                <FontAwesomeIcon icon={faCalendar} /> {state.downloadsData?.version}
              </Box>
            </>
          }
          size="small"
        />
      </TagsDialog>
    </Box>
  );
}

function DOITag() {
  const { state } = useContext(DownloadsContext);
  const PMID = /(?<=PMID:).*?(?=,\s)/gm.exec(state.downloadsData?.citeAs);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <PublicationsDrawer
        entries={[{ name: PMID, url: epmcUrl(PMID) }]}
        customLabel={
          <Chip
            component="span"
            label={
              <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {" "}
                <FontAwesomeIcon icon={faFileLines} /> Cite Us
              </Box>
            }
            size="small"
            clickable
          />
        }
      />
    </Box>
  );
}

function FormatsTag() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <TagsDialog
        title={"File Format"}
        body={
          <Box>
            Read about this format{" "}
            <Link to={"https://parquet.apache.org/docs/overview/"} external>
              here.
            </Link>
          </Box>
        }
      >
        <Chip
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {" "}
              <FontAwesomeIcon icon={faTableList} /> Parquet
            </Box>
          }
          size="small"
          clickable
        />
      </TagsDialog>
    </Box>
  );
}

function TagsDialog({ title = "", body = "", children = <></> }) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    if (!anchorEl) setAnchorEl(event.currentTarget);
    else handleClose();
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <div>
      <span aria-describedby={id} onMouseUp={handleClick}>
        {children}
      </span>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{ minWidth: "50vw", maxWidth: "100%" }}
      >
        <Box sx={{ m: 2, typography: "subtitle2" }}>
          <Box sx={{ color: theme => theme.palette.grey[600] }}>
            {" "}
            {title}
            <Divider />
          </Box>

          <Box sx={{ mt: 1 }}>{body}</Box>
        </Box>
      </Popover>
    </div>
  );
}
export default DownloadsTags;
