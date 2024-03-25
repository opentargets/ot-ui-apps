import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton, Slide, Snackbar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useState } from "react";
import { Tooltip } from "ui";

const styles = makeStyles(theme => ({
  snackbarContentMessage: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: ".75rem 1rem",
    width: "100%",
  },
  snackbarContentRoot: {
    padding: 0,
  },
}));

function CopyUrlButton() {
  const classes = styles();
  const [urlSnackbar, setUrlSnackbar] = useState(false);

  return (
    <>
      <Tooltip placement="bottom" title="Copy URL. Data sources controls not included">
        <IconButton
          onClick={() => {
            setUrlSnackbar(true);
            navigator.clipboard.writeText(window.location.href);
          }}
        >
          <FontAwesomeIcon size="xs" icon={faLink} />
        </IconButton>
      </Tooltip>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={urlSnackbar}
        onClose={() => {
          setUrlSnackbar(false);
        }}
        autoHideDuration={2000}
        TransitionComponent={Slide}
        ContentProps={{
          classes: {
            root: classes.snackbarContentRoot,
            message: classes.snackbarContentMessage,
          },
        }}
        message="URL copied"
      />
    </>
  );
}
export default CopyUrlButton;
