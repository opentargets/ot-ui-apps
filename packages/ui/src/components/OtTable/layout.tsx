import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Typography, styled } from "@mui/material";

export const OtTableContainer = styled("table")(theme => ({
  whiteSpace: "nowrap",
  borderCollapse: "collapse",
  minWidth: "100%",
  "& thead": {
    "& tr": {
      "&:hover": {
        backgroundColor: "transparent",
      },
      "&:first-child:not(:last-child)": {
        "& th:not(:last-child)": {
          borderRight: `1px solid ${theme.palette.grey[300]}`,
        },
      },
    },
  },
  "& tr": {
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
    "&:hover": {
      backgroundColor: theme.palette.grey[100],
    },
    "& td": {
      padding: "0.25rem 0.5rem",
    },
    "& th": {
      padding: "1rem 0.5rem",
    },
  },
}));

export const OtTableHeader = styled("div", {
  shouldForwardProp: prop => prop !== "canBeSorted",
})(({ canBeSorted }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: canBeSorted ? "pointer" : "auto",
  "& .sortableColumn": {
    visibility: "hidden",
    padding: "0 0.4rem",
  },
  "&:hover .sortableColumn": {
    visibility: "visible",
    opacity: "0.5",
  },
}));

export const FontAwesomeIconPadded = styled(FontAwesomeIcon)(({ theme }) => ({
  padding: `0 ${theme.spacing(1)}`,
}));
