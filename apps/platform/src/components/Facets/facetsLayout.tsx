import { Autocomplete, Select, styled } from "@mui/material";

export const FacetsSelect = styled(Select)(({ theme }) => ({
  minWidth: "150px",
  maxWidth: "150px",
  background: `${theme.palette.grey[200]}`,
  display: "flex",
  boxShadow: "none",
  ".MuiOutlinedInput-notchedOutline": {
    borderRight: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
}));

export const FacetsAutocomplete = styled(Autocomplete)(({ theme }) => ({
  minWidth: "320px",
  width: 1,
  maxWidth: 1,
  flexWrap: "nowrap",
  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    borderLeft: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
}));

export const FacetListItemContainer = styled("div")({
  p: 0,
  m: 0,
  display: "flex",
  width: "100%",
  flexDirection: "column",
});

export const FacetListItemLabel = styled("div")({
  w: 1,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "start",
  em: {
    fontWeight: "bold",
    fontStyle: "normal",
  },
});

export const FacetListItemCategory = styled("div")(({ theme }) => ({
  width: "100%",
  fontStyle: "italic",
  fontWeight: "bold",
  justifyContent: "end",
  textAlign: "end",
  color: theme.palette.primary.main,
}));
