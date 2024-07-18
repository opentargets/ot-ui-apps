import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Popper, styled } from "@mui/material";

export const OtTableContainer = styled("table")(({ theme }) => ({
  whiteSpace: "nowrap",
  borderCollapse: "collapse",
  minWidth: "100%",
  "& thead": {
    "& tr": {
      "&:hover": {
        backgroundColor: "transparent",
      },
      "&:first-of-type:not(:last-child)": {
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

export const ColumnFilterPopper = styled(Popper)(({ theme }) => ({
  maxHeight: "60vh",
  borderRadius: 4,
  border: `1px solid ${theme.palette.grey[400]}`,
  background: "white",
}));

export const OtTH = styled("th", {
  shouldForwardProp: prop => prop !== "stickyColumn",
})(({ theme, stickyColumn }) => ({
  ...(stickyColumn && {
    left: "0",
    position: "sticky",
    backgroundColor: theme.palette.grey[100],
    zIndex: 1,
  }),
}));

export const OtTD = styled("td", {
  shouldForwardProp: prop => prop !== "stickyColumn",
})(({ theme, stickyColumn }) => ({
  ...(stickyColumn && {
    left: "0",
    position: "sticky",
    backgroundColor: theme.palette.grey[100],
    zIndex: 1,
  }),
}));

export const OtTableHeaderText = styled(Box, {
  shouldForwardProp: prop => prop !== "verticalHeader",
})(({ verticalHeader }) => ({
  typography: "subtitle2",
  ...(verticalHeader && {
    writingMode: "vertical-rl",
    transform: "rotate(180deg)",
    // TODO: TBC
    maxHeight: "20rem",
    height: "14rem",
  }),
}));
