import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import classNames from "classnames";
import { DownloadLinkProps } from "./types";

const useStyles = makeStyles((theme: Theme) => ({
  base: {
    fontSize: "inherit",
    "text-decoration-color": "transparent",
    "-webkit-text-decoration-color": "transparent",
  },
  baseDefault: {
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.primary.dark,
      "text-decoration-color": theme.palette.primary.dark,
      "-webkit-text-decoration-color": theme.palette.primary.dark,
    },
  },
}));

const DownloadLink = ({ title, file }: DownloadLinkProps) => {
  const classes = useStyles();

  if (!file) return null;

  return (
    <span>
      {title}: {" "}
      <a className={classNames(classes.base, classes.baseDefault)} href={`/${file}`} download>
        {file}
      </a>
    </span>
  );
};

export default DownloadLink;
