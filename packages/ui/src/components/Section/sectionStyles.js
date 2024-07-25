import { makeStyles } from "@mui/styles";

const sectionStyles = makeStyles(theme => ({
  avatar: {
    color: "white",
    backgroundColor: theme.palette.grey[300],
  },
  avatarHasData: {
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
  avatarError: {
    backgroundColor: theme.palette.secondary.main,
  },
  cardHeaderAction: {
    alignSelf: "unset",
    margin: 0,
  },
  cardHeader: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  cardContent: {
    borderTop: `1px solid ${theme.palette.grey[300]}`,
    minHeight: 36,
  },
  description: {
    fontStyle: "italic",
    fontSize: "0.8rem",
    color: theme.palette.grey[400],
  },
  descriptionError: {
    color: theme.palette.secondary.main,
  },
  descriptionHasData: {
    color: theme.palette.grey[700],
  },
  loadingPlaceholder: {
    paddingTop: ".0625rem",
  },
  title: {
    color: theme.palette.grey[400],
    fontWeight: "bold !important",
    fontSize: "1.2rem !important",
  },
  titleHasData: {
    color: theme.palette.grey[700],
  },
  titleError: {
    color: theme.palette.secondary.main,
  },
  chip: {
    position: "relative",
    top: "5px",
  },
  noData: {
    display: "flex",
    fontStyle: "italic",
    justifyContent: "center",
  },
}));

export default sectionStyles;
